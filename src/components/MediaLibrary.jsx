import React, { useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Trash2, Upload } from "lucide-react";
import { addMedia, getMedia, removeMedia } from "@/lib/mediaLibrary";
import { uploadMediaFile } from "@/lib/backend";

export default function MediaLibrary({ onSelect, selectedId }) {
  const inputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => setMedia(getMedia()), []);

  const upload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Images must be smaller than 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const next = addMedia({ name: file.name, type: file.type, src: reader.result });
      setMedia(next);
      setError("");
      onSelect(next[0]);
      try {
        const uploaded = await uploadMediaFile(file, { id: next[0].id, name: file.name, type: file.type });
        if (uploaded?.src && uploaded.src !== next[0].src) {
          const synced = next.map((item) => item.id === next[0].id ? { ...item, src: uploaded.src, file_url: uploaded.file_url } : item);
          localStorage.setItem("bharatkatha_media_library", JSON.stringify(synced));
          setMedia(synced);
          onSelect(synced[0]);
        }
      } catch (uploadError) {
        setError(uploadError.message || "The image was saved locally but could not be uploaded.");
      }
    };
    reader.readAsDataURL(file);
  };

  const remove = (id) => {
    const next = removeMedia(id);
    setMedia(next);
    if (selectedId === id) onSelect(null);
  };

  return (
    <div className="rounded-xl border border-border bg-background/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Media library</h3>
          <p className="text-xs text-muted-foreground">Upload an image and reuse it in your katha.</p>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-background">
          <Upload className="h-3.5 w-3.5" /> Upload
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={upload} className="hidden" />
      </div>
      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
      {media.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              <button type="button" onClick={() => onSelect(item)} className="h-full w-full" title={`Use ${item.name}`}>
                <img src={item.src} alt={item.name} className="h-full w-full object-cover" />
                {selectedId === item.id && <span className="absolute inset-0 flex items-center justify-center bg-primary/40"><Check className="h-6 w-6 text-white" /></span>}
              </button>
              <button type="button" onClick={() => remove(item.id)} className="absolute right-1 top-1 rounded-md bg-background/80 p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" title="Delete image">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-muted-foreground hover:border-primary/50 hover:text-primary">
          <ImagePlus className="h-7 w-7" />
          <span className="mt-2 text-xs">Add your first image</span>
        </button>
      )}
    </div>
  );
}