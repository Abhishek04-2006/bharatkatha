import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { HERITAGE, getHeritage } from "@/data/heritage";
import AIDisclaimer from "@/components/AIDisclaimer";
import { generateWithGemini } from "@/api/backendClient";
import { addPoints } from "@/lib/gamification";

export default function Experience() {
  const [params] = useSearchParams();
  const heritageId = params.get("heritage") || "nalanda";
  const heritage = getHeritage(heritageId) || HERITAGE[0];

  const [started, setStarted] = useState(false);
  const [turns, setTurns] = useState([]); // {role, text}
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [turns, loading]);

  const begin = () => {
    setStarted(true);
    setTurns([{ role: "narrator", text: heritage.experienceIntro }]);
    setChoices([
      { label: "Explore the University", key: "explore" },
      { label: "Visit the Library", key: "library" },
      { label: "Talk to a Scholar", key: "talk" },
      { label: "Attend a Discussion", key: "discuss" },
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
            choices: {
              type: "array",
              items: { type: "object", properties: { label: { type: "string" }, key: { type: "string" } }, required: ["label"] },
            },
            ending: { type: "boolean" },
          },
          required: ["narrative", "choices"],
      });
      const narrative = res.narrative || res;
      const nextChoices = Array.isArray(res.choices) ? res.choices : [];
      setTurns((t) => [...t, { role: "narrator", text: narrative }]);
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

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 py-16">
        <div className="max-w-3xl w-full">
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Experience · Enter the Story</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            {heritage.name}
            <span className="block text-gradient-gold text-2xl md:text-3xl mt-2">{heritage.period}</span>
          </h1>
          <div className="mt-8 relative overflow-hidden rounded-3xl border border-border">
            <Image src={heritage.image} alt={heritage.name} className="h-72 w-full" fittingType="fill" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed italic">
            "{heritage.experienceIntro}"
          </p>
          <div className="mt-8">
            <button onClick={begin} className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-8 py-4 text-sm font-semibold text-background">
              <Play className="h-4 w-4" /> Begin the Experience
            </button>
          </div>
          <div className="mt-6 max-w-xl">
            <AIDisclaimer text="Historical Simulation — an AI-generated educational reconstruction based on historical sources. Not a primary historical record." />
          </div>
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
          <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <RotateCcw className="h-4 w-4" /> Restart
          </button>
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
                className={t.role === "user" ? "flex justify-end" : ""}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 leading-relaxed ${
                    t.role === "user"
                      ? "bg-primary/15 border border-primary/30 text-foreground"
                      : "glass text-foreground/90"
                  }`}
                >
                  {t.role === "user" && <span className="text-[11px] uppercase tracking-wide text-primary font-semibold">Your choice</span>}
                  <p className={t.role === "narrator" ? "mt-0 italic text-foreground/90" : ""}>{t.text}</p>
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
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </motion.div>
          )}

          {!loading && choices.length === 0 && turns.length > 1 && (
            <div className="pt-4">
              <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:border-primary/50 transition-colors">
                <RotateCcw className="h-4 w-4" /> Begin a new path
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card/40">
        <div className="max-w-3xl mx-auto px-5 py-3">
          <AIDisclaimer text="Historical Simulation — AI-generated educational reconstruction based on historical sources." />
        </div>
      </div>
    </div>
  );
}

function buildPrompt(heritage, history, choice) {
  return `You are an immersive historical storyteller for BharatKatha, an educational Indian heritage platform.
Setting: ${heritage.name} — ${heritage.location}, ${heritage.period} (${heritage.era}).
Historical context: ${heritage.shortHistory}

You are narrating an interactive second-person historical experience. The reader ("you") is a young person in this setting.
Keep the tone cinematic, vivid, sensory and historically grounded. Do NOT invent anachronisms. Keep each narrative segment to 3-5 sentences.

So far the story has unfolded:
${history.map((t) => (t.role === "user" ? `Reader chose: ${t.text}` : `Narrator: ${t.text}`)).join("\n")}

The reader just chose: "${choice.label}".
Write the next narrative segment that follows this choice naturally and immersively.
Then provide 2-4 new interactive choices for what the reader can do next. If the experience has reached a natural, meaningful conclusion, return an empty choices array and set ending=true.

Return JSON: { "narrative": string, "choices": [{ "label": string, "key": string }], "ending": boolean }.`;
}