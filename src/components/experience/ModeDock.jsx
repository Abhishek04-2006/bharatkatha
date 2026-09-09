import React from "react";
import { Compass, BookOpen, MessageCircle, Users } from "lucide-react";

const MODES = [
    { id: "explore", label: "Explore the University", short: "Explore", icon: Compass },
    { id: "library", label: "Visit the Library", short: "Library", icon: BookOpen },
    { id: "scholar", label: "Talk to the Scholar", short: "Scholar", icon: MessageCircle },
    { id: "discussion", label: "Attend a Discussion", short: "Debate", icon: Users },
];

export default function ModeDock({ mode, onSelect }) {
    return (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex flex-wrap justify-center gap-2 px-3">
            {MODES.map((m) => {
                const active = mode === m.id;
                return (
                    <button
                        key={m.id}
                        onClick={() => onSelect(m.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs sm:text-sm font-medium transition-all ${active
                            ? "bg-primary text-background border-primary btn-glow"
                            : "glass text-muted-foreground hover:text-foreground hover:border-primary/40"
                            }`}
                    >
                        <m.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{m.label}</span>
                        <span className="sm:hidden">{m.short}</span>
                    </button>
                );
            })}
        </div>
    );
}