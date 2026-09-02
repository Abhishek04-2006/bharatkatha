import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowLeft, Send, Loader2, Quote } from "lucide-react";
import { Image } from "@/components/ui/image";
import { CHARACTERS } from "@/data/heritage";
import AIDisclaimer from "@/components/AIDisclaimer";
import { generateWithGemini } from "@/api/backendClient";
import { addPoints } from "@/lib/gamification";

export default function CharacterStudio() {
  const [active, setActive] = useState(null);

  if (active) return <ChatView character={active} onBack={() => setActive(null)} />;

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-20 border-b border-border relative">
        <div className="absolute inset-0 grain opacity-40" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            <MessageCircle className="h-4 w-4" /> Meet History
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-tight">
            Converse with the <span className="text-gradient-gold">minds that shaped India</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Sit across from history's greatest thinkers. Ask them anything — about their work, their world, their wisdom.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CHARACTERS.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              onClick={() => setActive(c)}
              className="group text-left"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card card-hover">
                <div className="relative aspect-[3/4]">
                  <Image src={c.portrait} alt={c.name} className="h-full w-full transition-transform duration-700 group-hover:scale-105" fittingType="fill" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">{c.era}</span>
                  <h3 className="mt-1 font-display text-2xl font-bold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.knownFor}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageCircle className="h-3.5 w-3.5" /> Talk to {c.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}

function ChatView({ character, onBack }) {
  const [messages, setMessages] = useState([{ role: "character", text: character.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const suggested = [
    "What were you known for?",
    "Tell me about your greatest challenge.",
    "What can your era teach us today?",
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    addPoints(20, "conversationalist");
  }, []);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setLoading(true);
    setInput("");
    const history = [...messages, { role: "user", text: q }];
    setMessages(history);
    try {
      const reply = await generateWithGemini(buildCharPrompt(character, history));
      setMessages((m) => [...m, { role: "character", text: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "character", text: "Forgive me — the connection wavers. Please ask again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-border bg-card/40">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-card transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative h-11 w-11 rounded-full overflow-hidden border border-primary/30">
            <Image src={character.portrait} alt={character.name} className="h-full w-full" fittingType="fill" />
          </div>
          <div>
            <div className="font-display text-lg font-bold leading-none">{character.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{character.era} · {character.knownFor}</div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 py-8 space-y-5">
          <div className="rounded-2xl border border-border bg-card/50 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary mb-2">
              <Quote className="h-3.5 w-3.5" /> Historical Context
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{character.context}</p>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-5 py-4 leading-relaxed ${m.role === "user" ? "bg-primary/15 border border-primary/30" : "glass"}`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> {character.name.split(" ")[0]} is reflecting...
            </div>
          )}

          {messages.length === 1 && !loading && (
            <div className="pt-2 flex flex-wrap gap-2">
              {suggested.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card/40">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background pl-5 pr-2 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Ask ${character.name.split(" ")[0]}...`}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button onClick={() => send()} disabled={loading} className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-600 text-background disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <AIDisclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}

function buildCharPrompt(character, history) {
  return `You are role-playing as the historical figure ${character.name} for an educational platform called BharatKatha.
Era: ${character.era}. Known for: ${character.knownFor}.
Historical context: ${character.context}

Speak in first person as ${character.name}, in a warm, wise, historically grounded voice. Keep responses concise (3-6 sentences) unless the question needs more. Stay within what is historically plausible about this person's known life, work and era. Do NOT claim to know modern events after your lifetime, but you may reflect on timeless wisdom. Never claim your words here are your literal historical quotes — these are educational reconstructions.

Conversation so far:
${history.map((m) => (m.role === "user" ? `User: ${m.text}` : `${character.name}: ${m.text}`)).join("\n")}

Respond as ${character.name} to the user's latest message.`;
}