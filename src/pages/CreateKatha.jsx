import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Check, Loader2, Download, Share2, Bookmark, BookOpen, ImagePlus, Info, Scroll, Star } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { KATHA_THEMES, KATHA_SETTINGS, KATHA_TYPES } from "@/data/heritage";
import AIDisclaimer from "@/components/AIDisclaimer";
import { addPoints } from "@/lib/gamification";
import { createKatha, trackEvent } from "@/lib/backend";
import { generateWithGemini } from "@/api/backendClient";

const LANGUAGES = ["English", "Hindi", "Sanskrit", "Tamil", "Bengali", "Marathi"];
const LENGTHS = ["Short", "Medium", "Long"];
const TEMPLATES = [
  { id: "grandparent", name: "Grandparent's memory", desc: "Turn a family memory into a living katha.", idea: "<p>A young person listens to a grandparent's memory and discovers how it connects to a local tradition.</p>", character: "A curious grandchild and their storyteller grandparent" },
  { id: "artifact", name: "The hidden artifact", desc: "Follow an object through generations of history.", idea: "<p>An heirloom reveals a forgotten journey across India and the people who protected its meaning.</p>", character: "A young archivist who finds an inscription" },
  { id: "festival", name: "Festival of lights", desc: "Build a story around a celebration and its symbols.", idea: "<p>On the eve of a festival, a missing ritual object brings a community together to recover an old story.</p>", character: "A first-time festival volunteer" },
];

const EDITOR_MODULES = { toolbar: [["bold", "italic", "underline"], [{ header: [2, 3, false] }], [{ list: "ordered" }, { list: "bullet" }], ["blockquote", "clean"]] };

function stripHtml(value) {
  const element = document.createElement("div");
  element.innerHTML = value || "";
  return element.textContent || "";
}

// Parse a katha text into sections (Historical Context & Story)
function parseKathaText(text) {
  if (!text) return { historicalContext: null, story: text };

  // Try to find "Historical Context" section
  const historicalMatch = text.match(/(?:#{1,3}\s*)?(?:Historical Context|Historical Foundation|History|Background)[:\s\n]+([\s\S]*?)(?=(?:#{1,3}\s*)?(?:The Story|Story|Katha|Creative Story|Narrative)|$)/i);
  const storyMatch = text.match(/(?:#{1,3}\s*)?(?:The Story|Story|Katha|Creative Story|Narrative)[:\s\n]+([\s\S]*?)$/i);

  if (historicalMatch && storyMatch) {
    return {
      historicalContext: historicalMatch[1].trim(),
      story: storyMatch[1].trim(),
    };
  }

  // Fallback: return full text as story
  return { historicalContext: null, story: text };
}

export default function CreateKatha() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ theme: "", setting: "", type: "", idea: "", character: "", language: "English", length: "Medium", coverImage: null });
  const [story, setStory] = useState(null);
  const [parsedKatha, setParsedKatha] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const applyTemplate = (template) => {
    setForm((current) => ({ ...current, idea: `<p>${template.idea}</p>`, character: template.character }));
  };

  const steps = [
    { key: "theme", label: "Choose Theme", desc: "What world should your story live in?" },
    { key: "setting", label: "Choose Setting", desc: "Where does it unfold?" },
    { key: "type", label: "Story Type", desc: "How should it be told?" },
    { key: "details", label: "Your Story", desc: "Tell us what to weave." },
  ];

  const canNext = () => {
    if (step === 0) return !!form.theme;
    if (step === 1) return !!form.setting;
    if (step === 2) return !!form.type;
    return true;
  };

  const generate = async () => {
    setLoading(true);
    try {
      const prompt = `You are a master storyteller for BharatKatha, an Indian heritage platform.
Write an immersive, original ${form.type} story rooted in Indian heritage.

Theme: ${form.theme}
Setting: ${form.setting}
Story idea: ${stripHtml(form.idea) || "Surprise me with something fitting"}
Main character: ${form.character || "A young protagonist discovering their heritage"}
Language: ${form.language}
Length: ${form.length}

Guidelines:
- REQUIRED STRUCTURE: Begin with a clearly labelled "## Historical Context" section (2-3 sentences of real, verifiable historical context about ${form.setting} and ${form.theme}). Include the actual period, key figures, or documented facts.
- Then tell the fictional story under a "## The Story" heading.
- NEVER mix historical facts with fictional storytelling — keep them clearly in separate sections.
- In "The Story" section, you may reference the historical context, but the narrative itself is creative fiction.
- Make it vivid, cinematic and emotionally resonant. Honour the culture authentically.
- Write the story in ${form.language}.
- Do NOT add any notes after the story — end cleanly.`;

      const text = await generateWithGemini(prompt);
      setStory(text);
      setParsedKatha(parseKathaText(text));
      trackEvent("katha_generated", { theme: form.theme, type: form.type, language: form.language, length: form.length });
      addPoints(40, "story_weaver");
    } catch (e) {
      setStory(`The story could not be generated. ${e.message || "Please try again."}`);
      setParsedKatha(null);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      setSaveError("");
      await createKatha({ ...form, coverImage: form.coverImage?.src ? form.coverImage : null, story, created: new Date().toISOString() });
      trackEvent("katha_saved", { theme: form.theme, has_cover_image: Boolean(form.coverImage) });
      setSaved(true);
    } catch (error) {
      setSaveError(error.message || "The katha could not be saved.");
    }
  };

  const share = async () => {
    try {
      await navigator.share?.({ title: "My BharatKatha", text: story?.slice(0, 200) });
    } catch {
      navigator.clipboard?.writeText(story || "");
    }
  };

  if (story) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <button onClick={() => { setStory(null); setStep(3); }} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to studio
          </button>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-3">
            <Sparkles className="h-4 w-4" /> Your Katha
          </div>
          <h1 className="font-display text-4xl font-bold">{form.theme} in {form.setting}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1">{form.type}</span>
            <span className="rounded-full border border-border px-3 py-1">{form.language}</span>
            <span className="rounded-full border border-border px-3 py-1">{form.length}</span>
          </div>

          {form.coverImage && <img src={form.coverImage.src} alt={form.coverImage.name} className="mt-8 aspect-[16/7] w-full rounded-2xl object-cover" />}

          {/* Structured story output */}
          {parsedKatha && parsedKatha.historicalContext ? (
            <div className="mt-8 space-y-5">
              {/* Historical Foundation section */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Scroll className="h-4 w-4 text-amber-400 shrink-0" />
                  <h2 className="font-display text-base font-bold text-amber-300 uppercase tracking-widest">Historical Foundation</h2>
                  <span className="ml-auto text-[10px] text-amber-400/70 uppercase tracking-widest border border-amber-500/20 rounded px-2 py-0.5">Factual Context</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-body">{parsedKatha.historicalContext}</p>
                <p className="mt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Info className="h-3 w-3 text-amber-400" />
                  This historical context is based on verified sources. Verify specific claims with primary sources.
                </p>
              </div>

              {/* Creative Story section */}
              <div className="rounded-2xl border border-primary/20 bg-card p-6 md:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-primary shrink-0" />
                  <h2 className="font-display text-base font-bold text-primary uppercase tracking-widest">The Katha</h2>
                  <span className="ml-auto text-[10px] text-primary/50 uppercase tracking-widest border border-primary/20 rounded px-2 py-0.5">Creative Story · AI Fiction</span>
                </div>
                <article className="leading-relaxed text-foreground/90 whitespace-pre-wrap font-body">
                  {parsedKatha.story}
                </article>
              </div>
            </div>
          ) : (
            // Fallback: show as-is if parsing failed
            <article className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-10 leading-relaxed text-foreground/90 whitespace-pre-wrap font-body">
              {story}
            </article>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={save} disabled={saved} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-3 text-sm font-semibold text-background disabled:opacity-60">
              <Bookmark className="h-4 w-4" /> {saved ? "Saved!" : "Save Katha"}
            </button>
            <button onClick={share} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary/50 transition-colors">
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button onClick={() => { const blob = new Blob([story], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "my-katha.txt"; a.click(); }} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary/50 transition-colors">
              <Download className="h-4 w-4" /> Download
            </button>
            <Link to="/community" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary/50 transition-colors">
              Share to Community <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {saveError && <p className="mt-3 text-sm text-red-400">{saveError}</p>}
          <div className="mt-6 max-w-xl">
            <AIDisclaimer text="AI-generated story. Historical Foundation is labelled separately from Creative Story. The story section is fiction. Verify historical facts with primary sources." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-3">
          <Sparkles className="h-4 w-4" /> Create Your Katha
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold">Weave your own story from India's heritage</h1>
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-xl">
          Choose a theme, setting and story type. The AI will generate a Katha with a clear <span className="text-amber-300">Historical Foundation</span> and a separate <span className="text-primary">Creative Story</span>.
        </p>

        {/* Progress */}
        <div className="mt-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${i <= step ? "bg-primary text-background" : "bg-card border border-border text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden sm:block text-xs ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="font-display text-2xl font-bold">{steps[step].label}</h2>
              <p className="text-sm text-muted-foreground mt-1">{steps[step].desc}</p>

              {step === 0 && (
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {KATHA_THEMES.map((t) => (
                    <OptionCard key={t.id} active={form.theme === t.name} onClick={() => set("theme", t.name)} label={t.name} icon={t.icon} />
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="mt-6 grid sm:grid-cols-3 gap-3">
                  {KATHA_SETTINGS.map((s) => (
                    <button key={s.id} onClick={() => set("setting", s.name)} className={`rounded-xl border p-5 text-left transition-all ${form.setting === s.name ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                      <span className="font-display text-lg font-semibold">{s.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {KATHA_TYPES.map((t) => (
                    <button key={t.id} onClick={() => set("type", t.name)} className={`rounded-xl border p-5 text-left transition-all ${form.type === t.name ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                      <span className="font-display text-lg font-semibold">{t.name}</span>
                      <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              )}
              {step === 3 && (
                <div className="mt-6 space-y-5">
                  <Field label="Start with a template">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {TEMPLATES.map((template) => (
                        <button key={template.id} type="button" onClick={() => applyTemplate(template)} className="rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/60 hover:bg-primary/5">
                          <span className="font-display text-base font-semibold">{template.name}</span>
                          <p className="mt-1 text-xs text-muted-foreground">{template.desc}</p>
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Story idea">
                    <div className="overflow-hidden rounded-xl border border-border bg-background text-foreground">
                      <ReactQuill theme="snow" value={form.idea} onChange={(value) => set("idea", value)} modules={EDITOR_MODULES} placeholder="Write your premise, characters, and the feeling you want the story to carry..." />
                    </div>
                  </Field>
                  <Field label="Main character">
                    <input value={form.character} onChange={(e) => set("character", e.target.value)} placeholder="e.g. Meera, a curious apprentice at Nalanda" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Language">
                      <select value={form.language} onChange={(e) => set("language", e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                        {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                      </select>
                    </Field>
                    <Field label="Story length">
                      <div className="flex gap-2">
                        {LENGTHS.map((l) => (
                          <button key={l} onClick={() => set("length", l)} className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all ${form.length === l ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{l}</button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <Field label="Cover image (optional)">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        set("coverImage", {
                          id: file.name,
                          name: file.name,
                          src: URL.createObjectURL(file),
                          file_url: URL.createObjectURL(file),
                          type: file.type,
                        });
                      }}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    {form.coverImage && <button type="button" onClick={() => set("coverImage", null)} className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"><ImagePlus className="h-3.5 w-3.5" /> Remove selected image</button>}
                  </Field>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 3 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-7 py-3 text-sm font-semibold text-background disabled:opacity-50">
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={generate} disabled={loading} className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-7 py-3 text-sm font-semibold text-background disabled:opacity-60">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Weaving your Katha...</> : <><Sparkles className="h-4 w-4" /> Generate My Katha</>}
            </button>
          )}
        </div>
        {step === 3 && (
          <div className="mt-4">
            <AIDisclaimer text="The generated Katha will include a labelled Historical Foundation (verified context) and a separate Creative Story (AI fiction). They will be visually separated." />
          </div>
        )}
      </div>
    </div>
  );
}

function OptionCard({ active, onClick, label, icon }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${active ? "bg-primary text-background" : "bg-card text-primary"}`}>
        <BookOpen className="h-5 w-5" />
      </span>
      <span className="font-medium">{label}</span>
      {active && <Check className="h-4 w-4 text-primary ml-auto" />}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 font-semibold">{label}</label>
      {children}
    </div>
  );
}