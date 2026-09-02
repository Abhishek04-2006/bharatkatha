import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "node:http";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Server } from "socket.io";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const uploadDir = path.join(dataDir, "uploads");
const frontendDir = path.resolve(__dirname, "../dist");
const fs = await import("node:fs/promises");
await fs.mkdir(uploadDir, { recursive: true });

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, credentials: true } });
const db = new Database(path.join(dataDir, "bharatkatha.db"));
const jwtSecret = process.env.JWT_SECRET || "bharatkatha-local-development-secret";
const geminiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const port = Number(process.env.PORT || 8787);

db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS kathas (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS media_assets (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, url TEXT NOT NULL, mime_type TEXT, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS community_posts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS analytics_events (id TEXT PRIMARY KEY, user_id TEXT, event_name TEXT NOT NULL, properties TEXT NOT NULL, created_at TEXT NOT NULL);
`);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadDir));

function tokenFor(user) { return jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, jwtSecret, { expiresIn: "7d" }); }
function publicUser(user) { return { id: user.id, email: user.email, name: user.name, role: user.role, created_at: user.created_at }; }
function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  try { req.user = jwt.verify(token, jwtSecret); next(); } catch { res.status(401).json({ error: "Authentication required" }); }
}
function optionalAuth(req, _res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    try { req.user = jwt.verify(token, jwtSecret); } catch { /* Continue as a guest. */ }
  }
  next();
}
function admin(req, res, next) { return req.user.role === "admin" ? next() : res.status(403).json({ error: "Admin access required" }); }
function now() { return new Date().toISOString(); }
function record(table, row) { return { id: row.id, ...JSON.parse(row.payload), created_date: row.created_at, updated_date: row.updated_at }; }

app.get("/api/health", (_req, res) => res.json({ ok: true, database: "sqlite", realtime: true }));
app.post("/api/ai/generate", optionalAuth, async (req, res) => {
  if (!geminiKey) return res.status(503).json({ error: "Gemini is not configured. Set GEMINI_API_KEY on the server." });
  const { prompt, responseJsonSchema } = req.body;
  if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "A prompt is required" });
  const generationConfig = responseJsonSchema ? { responseMimeType: "application/json", responseSchema: responseJsonSchema } : {};
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "Gemini request failed" });
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
    if (!text) return res.status(502).json({ error: "Gemini returned an empty response" });
    let result = text;
    if (responseJsonSchema) {
      try { result = JSON.parse(text); } catch { return res.status(502).json({ error: "Gemini returned invalid structured data" }); }
    }
    res.json({ result });
  } catch (error) { res.status(502).json({ error: error.message || "Could not reach Gemini" }); }
});
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name || password.length < 8) return res.status(400).json({ error: "Name, email, and an 8-character password are required" });
  const user = { id: crypto.randomUUID(), email: email.toLowerCase().trim(), name: name.trim(), password_hash: await bcrypt.hash(password, 12), role: "user", created_at: now() };
  try { db.prepare("INSERT INTO users VALUES (@id,@email,@password_hash,@name,@role,@created_at)").run(user); } catch { return res.status(409).json({ error: "An account with this email already exists" }); }
  res.status(201).json({ user: publicUser(user), token: tokenFor(user) });
});
app.post("/api/auth/login", async (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(req.body.email?.toLowerCase().trim());
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password_hash))) return res.status(401).json({ error: "Invalid email or password" });
  res.json({ user: publicUser(user), token: tokenFor(user) });
});
app.post("/api/auth/forgot-password", (_req, res) => res.status(202).json({ message: "If the account exists, reset instructions will be sent." }));
app.post("/api/auth/reset-password", async (req, res) => {
  if (!req.body.resetToken || !req.body.newPassword) return res.status(400).json({ error: "Reset token and new password are required" });
  res.status(501).json({ error: "Email reset delivery is not configured yet. Use account settings after signing in." });
});
app.get("/api/auth/me", auth, (req, res) => res.json({ user: publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id)) }));

app.get("/api/kathas", auth, (req, res) => res.json(db.prepare("SELECT * FROM kathas WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id).map(record)));
app.post("/api/kathas", auth, (req, res) => {
  const id = crypto.randomUUID(); const created = now();
  db.prepare("INSERT INTO kathas VALUES (?,?,?,?,?)").run(id, req.user.id, JSON.stringify(req.body), created, created);
  res.status(201).json({ id, ...req.body, created_date: created, updated_date: created });
});

const upload = multer({ dest: uploadDir, limits: { fileSize: 5 * 1024 * 1024 } });
app.post("/api/media", auth, upload.single("file"), (req, res) => {
  if (!req.file?.mimetype.startsWith("image/")) return res.status(400).json({ error: "Only image files are supported" });
  const id = crypto.randomUUID(); const url = `/uploads/${req.file.filename}`; const created = now();
  db.prepare("INSERT INTO media_assets VALUES (?,?,?,?,?,?)").run(id, req.user.id, req.file.originalname, url, req.file.mimetype, created);
  res.status(201).json({ id, name: req.file.originalname, src: url, file_url: url, type: req.file.mimetype, created });
});
app.get("/api/media", auth, (req, res) => res.json(db.prepare("SELECT * FROM media_assets WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id).map((item) => ({ ...item, src: item.url }))));
app.delete("/api/media/:id", auth, (req, res) => { db.prepare("DELETE FROM media_assets WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id); res.status(204).end(); });

app.get("/api/community/posts", auth, (_req, res) => res.json(db.prepare("SELECT * FROM community_posts ORDER BY created_at DESC").all().map(record)));
app.post("/api/community/posts", auth, (req, res) => {
  const id = crypto.randomUUID(); const created = now(); const post = { ...req.body, id, creator: req.user.name };
  db.prepare("INSERT INTO community_posts VALUES (?,?,?,?,?)").run(id, req.user.id, JSON.stringify(post), created, created);
  const result = { ...post, created_date: created, updated_date: created }; io.emit("community:post", { type: "create", data: result, id, timestamp: created }); res.status(201).json(result);
});

app.post("/api/analytics/events", auth, (req, res) => { const id = crypto.randomUUID(); db.prepare("INSERT INTO analytics_events VALUES (?,?,?,?,?)").run(id, req.user.id, req.body.eventName, JSON.stringify(req.body.properties || {}), now()); res.status(202).end(); });
app.get("/api/admin/analytics", auth, admin, (_req, res) => res.json(db.prepare("SELECT event_name, COUNT(*) AS count FROM analytics_events GROUP BY event_name ORDER BY count DESC").all()));

app.use(express.static(frontendDir));
app.use((req, res, next) => req.path.startsWith("/api/") ? next() : res.sendFile(path.join(frontendDir, "index.html")));

io.on("connection", (socket) => socket.on("community:join", () => socket.join("community")));
app.use((error, _req, res, _next) => res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 500).json({ error: error.message || "Server error" }));
server.listen(port, () => console.log(`BharatKatha API listening on http://localhost:${port}`));