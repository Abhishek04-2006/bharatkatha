import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TIMELINE_ERAS, ALL_TIMELINE_EVENTS, YEAR_MIN, YEAR_MAX, formatYear } from "@/data/timeline";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function TimelineExplorer() {
    const [year, setYear] = useState(427);
    const [dragging, setDragging] = useState(false);
    const draggingRef = useRef(false);
    const trackRef = useRef(null);

    const span = YEAR_MAX - YEAR_MIN;
    const pct = clamp(((year - YEAR_MIN) / span) * 100, 0, 100);
    const activeEra =
        TIMELINE_ERAS.find((e) => year >= e.from && year <= e.to) ||
        TIMELINE_ERAS[TIMELINE_ERAS.length - 1];

    const setFromClientX = (clientX) => {
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        setYear(Math.round(YEAR_MIN + ratio * span));
    };

    const onPointerDown = (e) => {
        draggingRef.current = true;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
    };
    const onPointerMove = (e) => {
        if (draggingRef.current) setFromClientX(e.clientX);
    };
    const stop = () => {
        draggingRef.current = false;
        setDragging(false);
    };

    const jumpEra = (dir) => {
        const idx = TIMELINE_ERAS.indexOf(activeEra);
        const next = clamp(idx + dir, 0, TIMELINE_ERAS.length - 1);
        setYear(Math.round((TIMELINE_ERAS[next].from + TIMELINE_ERAS[next].to) / 2));
    };

    return (
        <div className="mt-8">
            {/* Year + era display */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-primary">
                        {activeEra.name} · {activeEra.period}
                    </div>
                    <div className="font-display text-5xl md:text-6xl font-bold text-gradient-gold leading-tight">
                        {formatYear(year)}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => jumpEra(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                        aria-label="Previous era"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => jumpEra(1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                        aria-label="Next era"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Draggable track */}
            <div
                ref={trackRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={stop}
                onPointerCancel={stop}
                className={`relative mt-8 h-24 select-none touch-none cursor-ew-resize ${dragging ? "cursor-grabbing" : ""}`}
            >
                {/* base line */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-border" />

                {/* era bands */}
                {TIMELINE_ERAS.map((e) => (
                    <div
                        key={e.id}
                        className="absolute top-1/2 -translate-y-1/2 h-3 rounded-full transition-opacity duration-300"
                        style={{
                            left: `${((e.from - YEAR_MIN) / span) * 100}%`,
                            width: `${((e.to - e.from) / span) * 100}%`,
                            backgroundColor: e.color,
                            opacity: activeEra.id === e.id ? 1 : 0.3,
                        }}
                    />
                ))}

                {/* event markers */}
                {ALL_TIMELINE_EVENTS.map((ev) => (
                    <button
                        key={`${ev.year}-${ev.title}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setYear(ev.year);
                        }}
                        title={`${formatYear(ev.year)} — ${ev.title}`}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-background transition-transform hover:scale-150"
                        style={{
                            left: `${((ev.year - YEAR_MIN) / span) * 100}%`,
                            backgroundColor: ev.color,
                            boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
                        }}
                    />
                ))}

                {/* scrubber */}
                <div
                    className="absolute top-0 bottom-0 -translate-x-1/2 pointer-events-none"
                    style={{ left: `${pct}%` }}
                >
                    <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-0.5 rounded bg-gradient-to-b from-primary via-primary to-transparent" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-primary ring-4 ring-primary/25 shadow-lg shadow-orange-900/40" />
                </div>

                {/* end labels */}
                <span className="absolute left-0 top-0 text-[10px] text-muted-foreground">{formatYear(YEAR_MIN)}</span>
                <span className="absolute right-0 top-0 text-[10px] text-muted-foreground">{formatYear(YEAR_MAX)}</span>
            </div>

            {/* Active era panel */}
            <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-xl font-bold">{activeEra.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{activeEra.desc}</p>
                <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...activeEra.events]
                        .sort((a, b) => a.year - b.year)
                        .map((ev) => {
                            const passed = ev.year <= year;
                            return (
                                <div
                                    key={ev.title}
                                    className={`rounded-xl border p-4 transition-all duration-300 ${passed
                                            ? "border-primary/40 bg-primary/5"
                                            : "border-border bg-background/50 opacity-55"
                                        }`}
                                >
                                    <span className="text-xs font-semibold text-primary">{formatYear(ev.year)}</span>
                                    <h4 className="mt-1 font-display text-base font-bold leading-snug">{ev.title}</h4>
                                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{ev.desc}</p>
                                    {!passed && (
                                        <span className="mt-2 inline-block text-[10px] uppercase tracking-wide text-muted-foreground">
                                            yet to come →
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>

            <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Drag the timeline · click a marker to jump to an event · use arrows to change era
            </p>
        </div>
    );
}