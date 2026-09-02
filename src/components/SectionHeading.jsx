import React from "react";

export default function SectionHeading({ eyebrow, title, subtitle, center }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && (
        <div className={`flex items-center gap-2 ${center ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">{eyebrow}</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
        </div>
      )}
      <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}