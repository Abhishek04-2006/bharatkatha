import React, { useState } from "react";
import { Camera, Instagram, Download, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const W = 1080;
const H = 1920;
const APP_URL = "bharat-katha.base44.app";

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = w;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

// Composes the raw 3D screenshot into a branded 1080x1920 story image
async function composeStoryImage(rawDataUrl, caption) {
    const img = await loadImage(rawDataUrl);
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#1a1005");
    grad.addColorStop(1, "#0c0703");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // screenshot panel
    const areaY = 260;
    const areaH = 1060;
    const scale = Math.max((W - 80) / img.width, areaH / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(40, areaY, W - 80, areaH);
    ctx.clip();
    ctx.drawImage(img, (W - dw) / 2, areaY + (areaH - dh) / 2, dw, dh);
    ctx.restore();
    ctx.strokeStyle = "#c8934a";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, areaY, W - 80, areaH);

    // branding
    ctx.textAlign = "center";
    ctx.fillStyle = "#f0b45a";
    ctx.font = "700 72px Georgia, serif";
    ctx.fillText("BharatKatha", W / 2, 150);

    ctx.fillStyle = "#c8934a";
    ctx.font = "600 26px Georgia, serif";
    ctx.fillText("— STEP INSIDE INDIA'S HISTORY —", W / 2, 205);

    ctx.fillStyle = "#f0d9a8";
    ctx.font = "400 40px Georgia, serif";
    const capLines = wrapText(ctx, caption, W - 160).slice(0, 3);
    capLines.forEach((l, i) => ctx.fillText(l, W / 2, 1430 + i * 56));

    ctx.fillStyle = "#9a7a4a";
    ctx.font = "500 28px Georgia, serif";
    ctx.fillText(APP_URL, W / 2, 1700);

    ctx.fillStyle = "#6e5638";
    ctx.font = "400 22px Georgia, serif";
    ctx.fillText("AI Historical Simulation · educational reconstruction", W / 2, 1760);

    return c.toDataURL("image/png");
}

export default function ShareSnapshot({ getSnapshot, caption }) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [imgUrl, setImgUrl] = useState(null);
    const { toast } = useToast();

    const capture = async () => {
        setBusy(true);
        try {
            const raw = getSnapshot?.();
            if (!raw) throw new Error("no canvas");
            const composed = await composeStoryImage(raw, caption);
            setImgUrl(composed);
            setOpen(true);
        } finally {
            setBusy(false);
        }
    };

    const download = () => {
        const a = document.createElement("a");
        a.href = imgUrl;
        a.download = "bharatkatha-story.png";
        a.click();
    };

    const share = async () => {
        try {
            const blob = await (await fetch(imgUrl)).blob();
            const file = new File([blob], "bharatkatha-story.png", { type: "image/png" });
            if (navigator.canShare?.({ files: [file] })) {
                await navigator.share({ files: [file], text: `${caption} — via BharatKatha` });
                setOpen(false);
                return;
            }
        } catch {
            return; // user cancelled the share sheet
        }
        // No native share (desktop) — save the image instead
        download();
        setOpen(false);
        toast({
            title: "Snapshot saved",
            description: "Open Instagram and add the image to your Story.",
        });
    };

    return (
        <>
            <button
                onClick={capture}
                disabled={busy}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-foreground hover:border-primary/50 transition-colors disabled:opacity-60"
            >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                <span className="hidden sm:inline">Share</span>
            </button>

            {open && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/85 backdrop-blur-sm px-4">
                    <div className="glass-strong rounded-2xl p-5 w-full max-w-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg font-bold">Your Story Snapshot</h3>
                            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <img src={imgUrl} alt="BharatKatha story snapshot" className="mt-4 max-h-[55vh] w-auto mx-auto rounded-xl border border-border" />
                        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                            Tap share and pick <span className="text-foreground font-medium">Instagram</span>, then choose{" "}
                            <span className="text-foreground font-medium">Add to Story</span>.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={share}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-600 px-4 py-3 text-sm font-semibold text-background btn-glow"
                            >
                                <Instagram className="h-4 w-4" /> Share to Story
                            </button>
                            <button
                                onClick={download}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}