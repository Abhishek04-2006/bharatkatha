import React from "react";
import { Info } from "lucide-react";

export default function AIDisclaimer({ text }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/80 leading-relaxed">
      <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
      <span>
        {text ||
          "AI Historical Simulation — responses are educational reconstructions based on historical information, not the person's actual words."}
      </span>
    </div>
  );
}