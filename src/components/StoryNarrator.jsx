import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, Square, Loader2, Sparkles } from "lucide-react";
import { fetchNarrationAudio } from "@/lib/backend";

export default function StoryNarrator({
  text,
  voiceId,
  title = "Story Narration",
  variant = "button", // "button" | "compact" | "card"
  className = "",
}) {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "playing" | "paused" | "error"
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const handlePlayToggle = async () => {
    if (!text || !text.trim()) return;

    // If currently playing -> pause
    if (status === "playing" && audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
      return;
    }

    // If paused -> resume
    if (status === "paused" && audioRef.current) {
      audioRef.current.play();
      setStatus("playing");
      return;
    }

    // If we already have audio loaded -> play from start
    if (audioRef.current && audioUrlRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setStatus("playing");
      return;
    }

    // Otherwise generate audio from ElevenLabs backend
    setStatus("loading");
    setErrorMsg("");

    try {
      // Clean story text (remove markdown headers for cleaner speech)
      const cleanText = text
        .replace(/#{1,6}\s+/g, "")
        .replace(/[*_~`]/g, "")
        .trim();

      const audioUrl = await fetchNarrationAudio(cleanText, voiceId);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration || 0);
      };

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setCurrentTime(audio.currentTime);
        }
      };

      audio.onended = () => {
        setStatus("idle");
        setProgress(0);
        setCurrentTime(0);
      };

      audio.onerror = () => {
        setStatus("error");
        setErrorMsg("Failed to playback audio stream");
      };

      await audio.play();
      setStatus("playing");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to generate narration");
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setStatus("idle");
    setProgress(0);
    setCurrentTime(0);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={handlePlayToggle}
          disabled={status === "loading" || !text}
          title={status === "playing" ? "Pause narration" : "Narrate with AI voice"}
          className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-foreground hover:text-amber-300 hover:border-amber-400/50 transition-all disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
          ) : status === "playing" ? (
            <Pause className="h-3.5 w-3.5 text-amber-400 fill-current" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span>{status === "playing" ? "Pause Voice" : status === "loading" ? "Voicing..." : "Voice Narration"}</span>
        </button>
        {(status === "playing" || status === "paused") && (
          <button
            type="button"
            onClick={handleStop}
            title="Stop narration"
            className="inline-flex items-center justify-center h-7 w-7 rounded-full glass hover:text-red-400 transition-colors"
          >
            <Square className="h-3 w-3 fill-current" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={handlePlayToggle}
          disabled={status === "loading" || !text}
          className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all shadow-sm ${
            status === "playing"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
              : status === "paused"
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
              : "border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/60"
          } disabled:opacity-50`}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
              <span>Generating Voice...</span>
            </>
          ) : status === "playing" ? (
            <>
              <Pause className="h-4 w-4 fill-current text-amber-400" />
              <span>Pause Narration</span>
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </>
          ) : status === "paused" ? (
            <>
              <Play className="h-4 w-4 fill-current text-amber-400" />
              <span>Resume Narration</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-amber-400" />
              <span>Narrate Story (AI Voice)</span>
            </>
          )}
        </button>

        {(status === "playing" || status === "paused") && (
          <button
            type="button"
            onClick={handleStop}
            title="Stop narration"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-red-500/50 transition-colors"
          >
            <Square className="h-4 w-4 fill-current text-muted-foreground hover:text-red-400" />
          </button>
        )}
      </div>

      {(status === "playing" || status === "paused") && (
        <div className="max-w-md rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
            <span className="text-amber-300 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> ElevenLabs Voice
            </span>
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="w-full bg-background/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "error" && errorMsg && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <VolumeX className="h-3.5 w-3.5 shrink-0" />
          {errorMsg}
        </p>
      )}
    </div>
  );
}
