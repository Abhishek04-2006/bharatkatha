import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, ArrowLeft, Send, Loader2, Quote,
  BookOpen, Info, ExternalLink, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { CHARACTERS } from "@/data/heritage";
import { generateWithGemini } from "@/api/backendClient";
import { addPoints } from "@/lib/gamification";

// Suggested questions per character
const SUGGESTED = {
  aryabhata: [
    "What is the place-value system you discovered?",
    "Tell me about how you calculated the Earth's circumference.",
    "Did you really believe the Earth was round and rotating?",
    "What was your greatest mathematical breakthrough?",
  ],
  chanakya: [
    "What is the most important principle in your Arthashastra?",
    "How did you help Chandragupta build an empire?",
    "What do you think makes a just ruler?",
    "What is the role of a teacher in statecraft?",
  ],
  chandragupta: [
    "How did you rise from humble beginnings to become emperor?",
    "What did Chanakya teach you about leadership?",
    "Why did you give up your empire to become a monk?",
    "What was the greatest challenge in unifying India?",
  ],
  kabir: [
    "What do your dohas (couplets) mean to you?",
    "How did you reconcile Hindu and Muslim devotion?",
    "Tell me about life as a weaver in Varanasi.",
    "What is the path to the Divine according to you?",
  ],
};

export default function CharacterStudio() {
  const [active, setActive] = useState(null);

  if (active) return <ChatView character={active} onBack={() => setActive(null)} />;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-20 border-b border-border relative">
        <div className="absolute inset-0 grain opacity-40" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
            <MessageCircle className="h-4 w-4" /> AI Historical Characters
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-tight">
            Converse with the <span className="text-gradient-gold">minds that shaped India</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Sit across from history's greatest thinkers. Ask them about their work, their world, their wisdom — powered by AI.
          </p>

          {/* Prominent disclaimer */}
          <div className="mt-6 max-w-2xl flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-5 py-4">
            <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-amber-300 mb-1">AI Historical Simulation</div>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                These conversations are AI-generated educational reconstructions. The responses are based on documented historical information about each figure — not their actual words. They are labelled clearly throughout. Always cross-reference with primary sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Character grid */}
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
  const [showContext, setShowContext] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const suggested = SUGGESTED[character.id] || [
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
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-card/40">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-card transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative h-11 w-11 rounded-full overflow-hidden border border-primary/30 shrink-0">
            <Image src={character.portrait} alt={character.name} className="h-full w-full" fittingType="fill" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-bold leading-none">{character.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{character.era} · {character.knownFor}</div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/8 px-3 py-1.5 text-[11px] text-amber-300">
            <Sparkles className="h-3 w-3" /> AI Simulation
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 py-8 space-y-5">

          {/* Historical context block (collapsible) */}
          <div className="rounded-2xl border border-border bg-card/50">
            <button
              onClick={() => setShowContext(!showContext)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary font-semibold">
                <Quote className="h-3.5 w-3.5" /> Historical Context & Sources
              </div>
              {showContext ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {showContext && (
              <div className="px-5 pb-5 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{character.context}</p>
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2.5">
                  <Info className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-200/70 leading-relaxed">
                    <strong className="text-amber-300">AI Historical Simulation:</strong> Responses are educational reconstructions based on documented historical information. These are not {character.name}'s actual words. Treat as an educational tool, not a primary source.
                  </p>
                </div>
              </div>
            )}
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
                {m.role === "character" && (
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border border-primary/20 mr-3 mt-1 shrink-0">
                    <Image src={character.portrait} alt={character.name} className="h-full w-full" fittingType="fill" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-5 py-4 leading-relaxed ${m.role === "user" ? "bg-primary/15 border border-primary/30" : "glass"}`}>
                  {m.role === "character" && (
                    <div className="text-[10px] uppercase tracking-[0.15em] text-primary/60 font-semibold mb-2">
                      {character.name} · AI Reconstruction
                    </div>
                  )}
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-primary/20 shrink-0">
                <Image src={character.portrait} alt={character.name} className="h-full w-full" fittingType="fill" />
              </div>
              <div className="flex items-center gap-2 glass rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>{character.name.split(" ")[0]} is reflecting...</span>
              </div>
            </div>
          )}

          {/* Suggested questions — show after greeting and whenever ≤ 1 character message */}
          {messages.filter(m => m.role === "character").length === 1 && !loading && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Suggested questions:</p>
              <div className="flex flex-col gap-2">
                {suggested.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-left text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-primary/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card/40">
        <div className="max-w-3xl mx-auto px-5 py-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background pl-5 pr-2 py-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Ask ${character.name.split(" ")[0]} anything about their life, work or era...`}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-600 text-background disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground text-center">
            AI Historical Simulation — educational reconstruction, not actual quotes
          </p>
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