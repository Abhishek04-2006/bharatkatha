import React, { useState, useRef, useEffect } from "react";
import { Loader2, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";

const GREETING =
  "Namaste, young traveller. I am Silabhadra, an elder of this university. For forty years I have taught logic and grammar within these walls. What would you ask of Nalanda?";

const SUGGESTED = [
  "What do you teach here?",
  "How large is the library?",
  "Describe a day at Nalanda.",
];

function buildPrompt(history) {
  return `You are role-playing Silabhadra, a senior scholar-monk at Nalanda University in the 5th century CE, for an educational platform.
Nalanda houses ~10,000 students and 2,000 teachers from across Asia; its library, the Dharmaganja, holds hundreds of thousands of manuscripts; subjects include logic (nyaya), grammar, medicine, astronomy and philosophy.
Speak warmly, first person, historically plausible, 3-5 sentences. Never reference anything after the 5th century CE. These are educational reconstructions, not literal quotes.

Conversation so far:
${history.map((m) => (m.role === "user" ? `Student: ${m.text}` : `Silabhadra: ${m.text}`)).join("\n")}

Respond as Silabhadra.`;
}

export default function ScholarChat() {
  const [messages, setMessages] = useState([{ role: "scholar", text: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setLoading(true);
    setInput("");
    const history = [...messages, { role: "user", text: q }];
    setMessages(history);
    try {
      const res = await base44.integrations.Core.InvokeLLM({ prompt: buildPrompt(history) });
      const reply = typeof res === "string" ? res : res.response || "…";
      setMessages((m) => [...m, { role: "scholar", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "scholar", text: "Forgive me — the wind took your words. Speak again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 w-[min(92vw,640px)]">
      <div className="glass-strong rounded-2xl p-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Silabhadra · Elder Scholar of Nalanda</div>
        <div ref={scrollRef} className="mt-3 max-h-44 overflow-y-auto space-y-2.5 pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-xl px-3.5 py-2 text-sm leading-relaxed ${m.role === "user" ? "bg-primary/15 border border-primary/30" : "bg-card/70 border border-border"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Silabhadra considers…
            </div>
          )}
        </div>
        {messages.length === 1 && !loading && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-background pl-4 pr-1.5 py-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask the scholar…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => send()} disabled={loading} className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-600 text-background disabled:opacity-50">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}