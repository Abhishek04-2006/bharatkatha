import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, RotateCcw, Loader2, BookOpen, MessageCircle, Info, Scroll, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { HERITAGE, CHARACTERS, getHeritage } from "@/data/heritage";
import AIDisclaimer from "@/components/AIDisclaimer";
import { generateWithGemini } from "@/api/backendClient";
import { addPoints } from "@/lib/gamification";

// Curated historical facts for Nalanda to show before AI narrative begins
const NALANDA_FACTS = [
  { label: "Founded", value: "5th Century CE under Gupta Emperor Kumaragupta I" },
  { label: "Students", value: "Over 10,000 students from across Asia at peak" },
  { label: "Teachers", value: "~2,000 scholars including Nagarjuna & Dharmakirti" },
  { label: "Library", value: "Dharmaganja — three multi-storey buildings of manuscripts" },
  { label: "Languages", value: "Sanskrit, Pali, Tibetan, Chinese" },
  { label: "Subjects", value: "Logic, grammar, medicine, astronomy, philosophy, arts" },
  { label: "Visitors", value: "Chinese pilgrim Xuanzang studied here for 5 years (630s CE)" },
  { label: "UNESCO", value: "World Heritage Site, Bihar, India" },
];

// Related characters for this experience
const NALANDA_CHARACTERS = ["aryabhata", "chandragupta"];

export default function Experience() {
  const [params] = useSearchParams();
  const heritageId = params.get("heritage") || "nalanda";
  const heritage = getHeritage(heritageId) || HERITAGE[0];

  const [started, setStarted] = useState(false);
  const [turns, setTurns] = useState([]);
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFacts, setShowFacts] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [turns, loading]);

  const begin = () => {
    setStarted(true);
    setTurns([{ role: "narrator", text: heritage.experienceIntro }]);
    setChoices([
      { label: "🏛️ Explore the university campus", key: "explore" },
      { label: "📚 Visit the Dharmaganja library", key: "library" },
      { label: "🧑‍🏫 Approach a scholar in debate", key: "talk" },
      { label: "🔭 Attend the astronomy lecture", key: "astronomy" },
    ]);
    addPoints(25, "time_traveler");
  };

  const choose = async (choice) => {
    if (loading) return;
    setLoading(true);
    setError("");
    const userTurn = { role: "user", text: choice.label };
    const history = [...turns, userTurn];
    setTurns(history);
    setChoices([]);

    try {
      const res = await generateWithGemini(buildPrompt(heritage, history, choice), {
        type: "object",
        properties: {
          narrative: { type: "string" },
          historicalNote: { type: "string" },
          choices: {
            type: "array",
            items: { type: "object", properties: { label: { type: "string" }, key: { type: "string" } }, required: ["label"] },
          },
          ending: { type: "boolean" },
        },
        required: ["narrative", "choices"],
      });
      const narrative = res.narrative || res;
      const historicalNote = res.historicalNote || null;
      const nextChoices = Array.isArray(res.choices) ? res.choices : [];
      setTurns((t) => [...t, { role: "narrator", text: narrative, historicalNote }]);
      setChoices(nextChoices);
    } catch (e) {
      setError(e.message || "The AI service could not respond.");
      setTurns((t) => [...t, { role: "narrator", text: "The story could not continue. Check the message below and try again." }]);
      setChoices([{ label: "Try again", key: choice.key }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStarted(false);
    setTurns([]);
    setChoices([]);
  };

  const relatedChars = CHARACTERS.filter((c) => NALANDA_CHARACTERS.includes(c.id));

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="relative h-[50vh] min-h-[360px]">
          <Image src={heritage.image} alt={heritage.name} className="h-full w-full" fittingType="fill" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 max-w-4xl mx-auto px-5 pb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Experience · Interactive Simulation</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              {heritage.name}
              <span className="block text-gradient-gold text-2xl md:text-3xl mt-2">{heritage.period}</span>
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 py-10 w-full space-y-8">
          {/* Historical Foundation Box */}
          {heritageId === "nalanda" && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Scroll className="h-4 w-4 text-amber-400 shrink-0" />
                <h2 className="font-display text-base font-bold text-amber-300 uppercase tracking-widest">Historical Foundation</h2>
                <span className="ml-auto text-[10px] text-amber-400/70 uppercase tracking-widest border border-amber-500/20 rounded px-2 py-0.5">Verified Sources</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{heritage.shortHistory}"</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {NALANDA_FACTS.map((f) => (
                  <div key={f.label} className="rounded-xl border border-border bg-card/60 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-primary mb-1">{f.label}</div>
                    <div className="text-xs text-foreground/80 leading-relaxed">{f.value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Sources: UNESCO World Heritage Listing · Xuanzang's <em>Great Tang Records</em> (7th c.) · Archaeological Survey of India
              </p>
            </div>
          )}

          {/* Intro narrative */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-primary shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">AI Reconstruction · Your Story Begins</span>
            </div>
            <p className="text-foreground/80 leading-relaxed italic">"{heritage.experienceIntro}"</p>
            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <button onClick={begin} className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-8 py-4 text-sm font-semibold text-background">
                <Play className="h-4 w-4" /> Begin the Experience
              </button>
              <span className="text-xs text-muted-foreground">3–4 choices · ~5 min · Educational</span>
            </div>
          </div>

          {/* Related historical characters */}
          {relatedChars.length > 0 && (
            <div>
              <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" /> Meet Figures From This Era
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedChars.map((c) => (
                  <Link
                    key={c.id}
                    to={`/characters`}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all"
                  >
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border border-primary/20 shrink-0">
                      <Image src={c.portrait} alt={c.name} className="h-full w-full" fittingType="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.knownFor} · {c.era}</div>
                      <div className="mt-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> Ask them anything
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <AIDisclaimer text="Historical Simulation — an AI-generated educational reconstruction based on verified historical sources. The narrative is fiction; all labeled facts are sourced." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-border bg-card/40">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-primary">{heritage.period}</div>
            <div className="font-display text-lg font-bold">{heritage.name}</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/characters" className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-full px-3 py-1.5">
              <MessageCircle className="h-3.5 w-3.5" /> Chat with a Scholar
            </Link>
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <RotateCcw className="h-4 w-4" /> Restart
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 py-8 space-y-5">
          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

          <AnimatePresence initial={false}>
            {turns.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={t.role === "user" ? "flex justify-end" : "space-y-2"}
              >
                {t.role === "narrator" && t.historicalNote && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/80">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-400" />
                    <span><strong className="text-amber-300">Historical Fact:</strong> {t.historicalNote}</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 leading-relaxed ${
                    t.role === "user"
                      ? "bg-primary/15 border border-primary/30 text-foreground"
                      : "glass text-foreground/90"
                  }`}
                >
                  {t.role === "user" && (
                    <span className="text-[11px] uppercase tracking-wide text-primary font-semibold block mb-1">Your choice</span>
                  )}
                  {t.role === "narrator" && (
                    <span className="text-[10px] uppercase tracking-[0.15em] text-primary/60 font-semibold block mb-2">
                      ✦ AI Reconstruction
                    </span>
                  )}
                  <p className={t.role === "narrator" ? "italic text-foreground/90" : ""}>{t.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> The story unfolds...
            </div>
          )}

          {!loading && choices.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-3 grid sm:grid-cols-2 gap-3">
              {choices.map((c) => (
                <button
                  key={c.key || c.label}
                  onClick={() => choose(c)}
                  className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-5 py-4 text-left text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all"
                >
                  {c.label}
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </motion.div>
          )}

          {!loading && choices.length === 0 && turns.length > 1 && (
            <div className="pt-4 space-y-3">
              <p className="text-sm text-muted-foreground italic text-center">Your time at Nalanda draws to a close. A different path awaits.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary/50 transition-colors">
                  <RotateCcw className="h-4 w-4" /> Begin a new path
                </button>
                <Link to="/characters" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-5 py-2.5 text-sm font-semibold text-background">
                  <MessageCircle className="h-4 w-4" /> Talk to a Historical Figure
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card/40">
        <div className="max-w-3xl mx-auto px-5 py-3">
          <AIDisclaimer text="Historical Simulation — AI-generated educational reconstruction. Narrative is fictional; 'Historical Fact' labels mark verified information." />
        </div>
      </div>
    </div>
  );
}

function buildPrompt(heritage, history, choice) {
  return `You are an immersive historical storyteller for BharatKatha, an educational Indian heritage platform.
Setting: ${heritage.name} — ${heritage.location}, ${heritage.period} (${heritage.era}).
Historical context: ${heritage.shortHistory}

You are narrating an interactive second-person historical experience. The reader ("you") is a young scholar arriving at Nalanda for the first time.
Keep the tone cinematic, vivid, sensory and historically grounded. Do NOT invent anachronisms. Keep each narrative segment to 3-5 sentences.
Also provide a SHORT one-sentence "historicalNote" — a REAL verified historical fact about Nalanda relevant to this scene (clearly sourced from the actual historical record). Keep it brief and factual.

So far the story has unfolded:
${history.map((t) => (t.role === "user" ? `Reader chose: ${t.text}` : `Narrator: ${t.text}`)).join("\n")}

The reader just chose: "${choice.label}".
Write the next narrative segment that follows this choice naturally and immersively.
Then provide 2-4 new interactive choices for what the reader can do next. If the experience has reached a natural, meaningful conclusion (after 3-4 rounds), return an empty choices array and set ending=true.

Return JSON: { "narrative": string, "historicalNote": string, "choices": [{ "label": string, "key": string }], "ending": boolean }.`;
}