import React from "react";
import { motion } from "framer-motion";

const CLOUDS = Array.from({ length: 9 }, (_, i) => ({
    top: 8 + ((i * 37) % 84),
    size: 160 + ((i * 83) % 240),
    dur: 2.2 + ((i * 13) % 20) / 10,
    delay: ((i * 7) % 30) / 10,
    opacity: 0.25 + ((i * 11) % 50) / 100,
}));

export default function TimeTravelOverlay() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[70] overflow-hidden bg-gradient-to-b from-[#1a1005] via-[#2a1a0a] to-[#150d06]"
        >
            {/* drifting clouds */}
            {CLOUDS.map((c, i) => (
                <motion.div
                    key={i}
                    initial={{ x: "-40vw" }}
                    animate={{ x: "140vw" }}
                    transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "linear" }}
                    className="absolute rounded-full"
                    style={{
                        top: `${c.top}%`,
                        width: c.size,
                        height: c.size * 0.55,
                        background: "radial-gradient(ellipse at center, rgba(255,236,200,0.9), rgba(255,236,200,0) 70%)",
                        filter: "blur(28px)",
                        opacity: c.opacity,
                    }}
                />
            ))}

            {/* speed streaks */}
            {Array.from({ length: 14 }, (_, i) => (
                <motion.div
                    key={`s${i}`}
                    initial={{ x: "-20vw", opacity: 0 }}
                    animate={{ x: "120vw", opacity: [0, 0.7, 0] }}
                    transition={{ duration: 0.7 + ((i * 5) % 10) / 20, repeat: Infinity, delay: (i * 3) / 10, ease: "easeIn" }}
                    className="absolute h-px w-40 bg-gradient-to-r from-transparent via-amber-200/80 to-transparent"
                    style={{ top: `${(i * 71) % 100}%` }}
                />
            ))}

            {/* center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="text-xs uppercase tracking-[0.3em] text-amber-200/80"
                >
                    Traveling back in time…
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-4 font-display text-4xl md:text-6xl font-bold text-gradient-gold"
                >
                    5th Century CE · Nalanda
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed"
                >
                    Ten thousand scholars. A nine-storey library. The world's first great university rises before you.
                </motion.p>
            </div>
        </motion.div>
    );
}