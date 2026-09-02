import React from "react";
import { ImagePlus } from "lucide-react";
import MediaLibrary from "@/components/MediaLibrary";

export default function MediaLibraryPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><ImagePlus className="h-5 w-5" /></span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Creator tools</p>
            <h1 className="font-display text-4xl font-bold">Media library</h1>
          </div>
        </div>
        <MediaLibrary onSelect={() => {}} />
      </div>
    </div>
  );
}