import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Play, Orbit } from "lucide-react";
import ImmersiveCanvas from "@/components/live/ImmersiveCanvas";
import TouchJoystick from "@/components/live/TouchJoystick";
import AIDisclaimer from "@/components/AIDisclaimer";
import StoryNarrator from "@/components/StoryNarrator";
import { addPoints } from "@/lib/gamification";

// Split the generated story into walkable panels (~1 panel per story beat)
function toPanels(story) {
    if (!story) return [];
    const paras = story
        .split(/\n+/)
        .map((s) => s.replace(/[#*_>`]/g, "").trim())
        .filter((s) => s.length > 0);
    const chunks = [];
    paras.forEach((p) => {
        if (p.length <= 300) chunks.push(p);
        else for (let i = 0; i < p.length; i += 290) chunks.push(p.slice(i, i + 290));
    });
    return chunks.slice(0, 16);
}

export default function LiveExperience() {
    const [params] = useSearchParams();
    const canvasRef = useRef(null);
    const [katha, setKatha] = useState(undefined); // undefined = loading
    const [started, setStarted] = useState(false);
    const [vrSupported, setVrSupported] = useState(false);
    const isTouch = typeof window !== "undefined" && "ontouchstart" in window;

    useEffect(() => {
        const kathas = JSON.parse(localStorage.getItem("bharatkatha_kathas") || "[]");
        const id = params.get("katha");
        setKatha(kathas.find((k) => k.id === id) || kathas[0] || null);
        navigator.xr?.isSessionSupported("immersive-vr").then(setVrSupported).catch(() => { });
    }, [params]);

    const panels = useMemo(() => toPanels(katha?.story), [katha]);

    if (katha === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                Loading your katha…
            </div>
        );
    }

    if (!katha) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 text-center">
                <Orbit className="h-10 w-10 text-primary" />
                <h1 className="font-display text-3xl font-bold">No Katha found</h1>
                <p className="text-muted-foreground">Create your own story first — then live it in 3D.</p>
                <Link
                    to="/create"
                    className="btn-glow rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-3 text-sm font-semibold text-background"
                >
                    Create a Katha
                </Link>
            </div>
        );
    }

    const begin = () => {
        setStarted(true);
        addPoints(25, "time_traveler");
        if (!isTouch) canvasRef.current?.requestLock();
    };

    return (
        <div className="fixed inset-0 z-[60] bg-background">
            <ImmersiveCanvas ref={canvasRef} theme={katha.setting} paragraphs={panels} />

            {/* HUD */}
            <div className="pointer-events-none absolute top-0 inset-x-0 p-4 flex items-center justify-between z-20">
                <Link
                    to="/create"
                    className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-sm text-foreground hover:border-primary/50 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Link>
                <div className="pointer-events-auto flex items-center gap-3">
                    <StoryNarrator text={katha.story} variant="compact" />
                    <div className="glass rounded-full px-4 py-2 text-xs text-amber-200 hidden sm:block">
                        3D Live Experience · {katha.theme} in {katha.setting}
                    </div>
                </div>
            </div>

            {started && (
                <>
                    <div className="pointer-events-none absolute bottom-6 inset-x-0 flex justify-center">
                        <div className="glass rounded-full px-5 py-2 text-xs text-muted-foreground">
                            {isTouch
                                ? "Joystick to walk · drag to look around"
                                : "WASD / arrows to walk · drag or click to look · ESC to release"}
                        </div>
                    </div>
                    {isTouch && <TouchJoystick onChange={(x, y) => canvasRef.current?.setMove(x, y)} />}
                    {vrSupported && (
                        <button
                            onClick={() => canvasRef.current?.enterVR()}
                            className="btn-glow absolute bottom-16 right-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-6 py-3 text-sm font-semibold text-background"
                        >
                            <Orbit className="h-4 w-4" /> Enter VR
                        </button>
                    )}
                </>
            )}

            {/* Start overlay */}
            {!started && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm px-5">
                    <div className="max-w-lg w-full rounded-3xl glass-strong p-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                            <Orbit className="h-7 w-7 text-primary" />
                        </div>
                        <div className="mt-3 text-xs uppercase tracking-[0.2em] text-primary">3D Live Experience</div>
                        <h1 className="mt-2 font-display text-3xl font-bold">Live your Katha in first person</h1>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            Walk a torch-lit world of {katha.setting} and follow your story across{" "}
                            {panels.length > 0 ? `${panels.length} glowing panels` : "the glowing panels"} — then step
                            fully inside with a VR headset.
                        </p>
                        <div className="mt-5 rounded-xl border border-border bg-card/60 p-4 text-left text-xs text-muted-foreground space-y-1.5">
                            <p>• WASD / arrow keys — walk the path</p>
                            <p>• Drag (or click to lock) — look around</p>
                            {vrSupported ? (
                                <p className="text-primary">• VR headset detected — "Enter VR" available below</p>
                            ) : (
                                <p>• VR: open this page in a WebXR headset browser (e.g. Meta Quest) to enter fully</p>
                            )}
                        </div>
                        <button
                            onClick={begin}
                            className="btn-glow mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-8 py-3.5 text-sm font-semibold text-background"
                        >
                            <Play className="h-4 w-4" /> Begin Experience
                        </button>
                        <div className="mt-5">
                            <AIDisclaimer text="AI-generated educational reconstruction — the walk-through scenery is illustrative, not historically exact." />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}