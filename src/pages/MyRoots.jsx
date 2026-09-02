import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Landmark, Music, UtensilsCrossed, Sparkles, BookOpen, Languages, Mic, Video, Image as ImageIcon, PenLine, Loader2, Heart, Check } from "lucide-react";
import { ROOTS_DATA } from "@/data/heritage";
import { uploadMediaFile } from "@/lib/backend";
import { addPoints } from "@/lib/gamification";

const LOCATIONS = Object.keys(ROOTS_DATA);

export default function MyRoots() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [preserving, setPreserving] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preserved, setPreserved] = useState([]);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("bharatkatha_roots") || "[]");
    setPreserved(p);
  }, []);

  const search = (q) => {
    setQuery(q);
    const match = LOCATIONS.find((l) => l.toLowerCase().includes(q.toLowerCase()));
    if (match) setSelected(ROOTS_DATA[match]);
  };

  const pick = (loc) => {
    setQuery(loc);
    setSelected(ROOTS_DATA[loc]);
  };

  const doUpload = async (type, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadMediaFile(file, { name: file.name, type: file.type });
      const entry = { type, title: file.name, url: uploaded.file_url, created: new Date().toISOString() };
      const all = [entry, ...preserved];
      setPreserved(all);
      localStorage.setItem("bharatkatha_roots", JSON.stringify(all));
      addPoints(30, "root_keeper");
      setPreserving(null);
    } catch (e) {
      alert("Upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  };

  const saveStory = (text) => {
    if (!text.trim()) return;
    const entry = { type: "story", title: text.slice(0, 40) + "...", text, created: new Date().toISOString() };
    const all = [entry, ...preserved];
    setPreserved(all);
    localStorage.setItem("bharatkatha_roots", JSON.stringify(all));
    addPoints(30, "root_keeper");
    setPreserving(null);
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-16 md:py-20 border-b border-border">
        <div className="absolute inset-0 grain opacity-40" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            <MapPin className="h-4 w-4" /> My Roots
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-tight">
            Discover the heritage of <span className="text-gradient-gold">your hometown</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Every town holds a thousand stories. Search yours to uncover its history, traditions and living culture.
          </p>

          <div className="mt-8 max-w-xl relative">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card pl-5 pr-2 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="e.g. Prayagraj, Uttar Pradesh"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            {query && !selected && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-border bg-card overflow-hidden">
                {LOCATIONS.filter((l) => l.toLowerCase().includes(query.toLowerCase())).map((l) => (
                  <button key={l} onClick={() => pick(l)} className="block w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-colors">{l}</button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {LOCATIONS.map((l) => (
              <button key={l} onClick={() => pick(l)} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </section>

      {selected ? (
        <RootsView data={selected} onPreserve={(t) => setPreserving(t)} />
      ) : (
        <section className="py-20 text-center">
          <div className="max-w-md mx-auto px-5">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">Search your hometown</h2>
            <p className="mt-2 text-sm text-muted-foreground">We're growing our roots database. A few regions are ready to explore now.</p>
          </div>
        </section>
      )}

      {/* Preserve a story */}
      <section className="py-16 border-t border-border">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-3">
            <Heart className="h-4 w-4" /> Preserve a Story From Your Family
          </div>
          <h2 className="font-display text-3xl font-bold">Keep your family's stories alive</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">Oral history vanishes in a generation. Record an elder's voice, a photo, a memory — and preserve it for the future.</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <PreserveBtn icon={Mic} label="Upload Audio" onClick={() => setPreserving("audio")} />
            <PreserveBtn icon={Video} label="Upload Video" onClick={() => setPreserving("video")} />
            <PreserveBtn icon={ImageIcon} label="Upload Photo" onClick={() => setPreserving("photo")} />
            <PreserveBtn icon={PenLine} label="Write a Story" onClick={() => setPreserving("story")} />
          </div>

          {preserved.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display text-lg font-bold mb-4">Your preserved stories</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {preserved.map((p, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 text-xs text-primary">
                      {p.type === "story" ? <PenLine className="h-3.5 w-3.5" /> : p.type === "audio" ? <Mic className="h-3.5 w-3.5" /> : p.type === "video" ? <Video className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                      <span className="uppercase tracking-wide">{p.type}</span>
                    </div>
                    <p className="mt-2 text-sm text-foreground line-clamp-2">{p.title}</p>
                    {p.type === "photo" && <img src={p.url} alt={p.title} className="mt-3 rounded-lg h-32 w-full object-cover" />}
                    <p className="mt-2 text-[11px] text-muted-foreground">{new Date(p.created).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {preserving && (
        <PreserveModal type={preserving} uploading={uploading} onClose={() => setPreserving(null)} onUpload={doUpload} onSaveStory={saveStory} />
      )}
    </div>
  );
}

function RootsView({ data, onPreserve }) {
  const blocks = [
    { icon: Landmark, label: "Historical Places", items: data.historicalPlaces },
    { icon: Sparkles, label: "Local Traditions", items: data.localTraditions },
    { icon: UtensilsCrossed, label: "Food", items: data.food },
    { icon: Music, label: "Folk Culture", items: data.folkCulture },
    { icon: Sparkles, label: "Festivals", items: data.festivals },
    { icon: BookOpen, label: "Local Stories", items: data.localStories },
    { icon: Languages, label: "Languages / Dialects", items: data.languages },
  ];
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-14">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">{data.region}</h2>
            <p className="text-muted-foreground">{data.state}</p>
          </div>
          <button onClick={() => onPreserve("story")} className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 text-sm text-primary hover:bg-primary/10 transition-colors">
            <Heart className="h-4 w-4" /> Preserve a story
          </button>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blocks.map((b) => (
            <div key={b.label} className="rounded-2xl border border-border bg-card p-5 card-hover">
              <div className="flex items-center gap-2 text-primary">
                <b.icon className="h-4 w-4" />
                <h3 className="font-display text-lg font-bold text-foreground">{b.label}</h3>
              </div>
              <ul className="mt-3 space-y-2">
                {b.items.map((it) => (
                  <li key={it} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function PreserveBtn({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 card-hover">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function PreserveModal({ type, uploading, onClose, onUpload, onSaveStory }) {
  const [story, setStory] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-xl font-bold capitalize">{type === "story" ? "Write a story" : `Upload ${type}`}</h3>
        <p className="mt-1 text-sm text-muted-foreground">Preserve a piece of your family's heritage.</p>
        <div className="mt-5">
          {type === "story" ? (
            <>
              <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={5} placeholder="My grandmother used to tell me..." className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              <button onClick={() => onSaveStory(story)} disabled={!story.trim()} className="mt-4 w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600 py-3 text-sm font-semibold text-background disabled:opacity-50">Save Story</button>
            </>
          ) : (
            <>
              <label className="block rounded-xl border-2 border-dashed border-border hover:border-primary/50 p-8 text-center cursor-pointer transition-colors">
                <input type="file" accept={type === "audio" ? "audio/*" : type === "video" ? "video/*" : "image/*"} className="hidden" onChange={(e) => onUpload(type, e.target.files[0])} />
                {uploading ? <><Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" /><p className="mt-2 text-sm text-muted-foreground">Uploading...</p></> : <><div className="mx-auto h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Check className="h-5 w-5" /></div><p className="mt-3 text-sm text-muted-foreground">Click to choose a {type} file</p></>}
              </label>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}