import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PROMPT = `You are writing a scene for an immersive historical reconstruction of a debate at Nalanda University, 5th century CE.
Two senior scholars debate before their peers. Choose a classic Nalanda debate topic — e.g. "Is logic (nyaya) the foundation of all knowledge, or scripture (agama)?", "Does the self exist?", "Which comes first — grammar or meaning?".
Give each scholar a plausible Sanskrit name (e.g. Dharmapala, Gunamati, Shantideva, Silabhadra). Write 6-8 exchanges total, alternating speakers. Each line is 1-2 sentences, formal but fiery, in simple English. Stay historically plausible — no anachronisms.`;

const SCHEMA = {
    type: "object",
    properties: {
        topic: { type: "string" },
        lines: {
            type: "array",
            items: {
                type: "object",
                properties: { speaker: { type: "string" }, line: { type: "string" } },
                required: ["speaker", "line"],
            },
        },
    },
    required: ["topic", "lines"],
};

export default function DebatePanel() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shown, setShown] = useState(0);

    const generate = async () => {
        setLoading(true);
        setData(null);
        setShown(0);
        try {
            const res = await base44.integrations.Core.InvokeLLM({ prompt: PROMPT, response_json_schema: SCHEMA });
            setData(res);
        } catch {
            setData({
                topic: "A debate at Nalanda",
                lines: [{ speaker: "Silabhadra", line: "The assembly grows quiet — the wind itself seems to listen. Speak, and we shall begin anew." }],
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generate();
    }, []);

    useEffect(() => {
        if (!data || shown >= data.lines.length) return;
        const t = setTimeout(() => setShown((s) => s + 1), 3200);
        return () => clearTimeout(t);
    }, [data, shown]);

    return (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 w-[min(92vw,640px)]">
            <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-primary">The Debate Courtyard</div>
                        <h3 className="font-display text-lg font-bold leading-tight truncate">
                            {loading ? "The assembly gathers…" : data?.topic}
                        </h3>
                    </div>
                    {!loading && (
                        <button
                            onClick={generate}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                        >
                            <RefreshCw className="h-3.5 w-3.5" /> New debate
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" /> Scholars take their seats…
                    </div>
                )}

                {data && (
                    <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                        {data.lines.slice(0, shown).map((l, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <span className="text-xs font-semibold text-primary">{l.speaker}:</span>{" "}
                                <span className="text-sm text-foreground/90">{l.line}</span>
                            </motion.div>
                        ))}
                        {shown < data.lines.length && (
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-xs text-muted-foreground">
                                …
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}