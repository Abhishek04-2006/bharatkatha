import React, { useRef } from "react";

export default function TouchJoystick({ onChange }) {
    const ref = useRef(null);
    const active = useRef(false);

    const update = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = (e.clientX - cx) / (rect.width / 2);
        let dy = (e.clientY - cy) / (rect.height / 2);
        const len = Math.hypot(dx, dy);
        if (len > 1) { dx /= len; dy /= len; }
        onChange(dx, dy);
    };

    const stop = () => {
        active.current = false;
        onChange(0, 0);
    };

    return (
        <div
            ref={ref}
            onPointerDown={(e) => {
                active.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                update(e);
            }}
            onPointerMove={(e) => active.current && update(e)}
            onPointerUp={stop}
            onPointerCancel={stop}
            className="absolute bottom-8 left-8 z-20 h-32 w-32 touch-none rounded-full border border-primary/40 bg-background/50 backdrop-blur-sm"
        >
            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Move
            </div>
            <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/70" />
        </div>
    );
}