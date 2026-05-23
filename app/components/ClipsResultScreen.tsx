"use client";

import { useState, useRef } from "react";
import {
  Download,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Archive,
  Scissors,
} from "lucide-react";
import type { ProcessingResult, VideoMeta } from "../types/clivo";

interface ClipsResultScreenProps {
  result: ProcessingResult;
  meta: VideoMeta;
  onReset: () => void;
}

function formatTime(s: number) {
  const total = Math.floor(s);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  if (m > 0) return sec > 0 ? `${m}m ${sec}s` : `${m}m`;
  return `${sec}s`;
}

function ClipCard({
  clip,
  index,
}: {
  clip: ProcessingResult["clips"][0];
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleDownload = () => {
    // Real: trigger presigned URL download
    setDownloaded(true);
    const a = document.createElement("a");
    a.href = clip.url;
    a.download = clip.filename;
    a.target = "_blank";
    a.click();
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div
      className="group bg-[var(--clivo-surface)] border border-[var(--clivo-border)] rounded-2xl overflow-hidden
                 hover:border-[var(--clivo-border-hover)] hover:shadow-[var(--clivo-shadow-md)]
                 transition-all duration-200"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Video preview */}
      <div className="relative aspect-video bg-[var(--clivo-muted)] overflow-hidden">
        <video
          ref={videoRef}
          src={clip.url}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          onEnded={() => setPlaying(false)}
          muted
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center
                      transition-opacity duration-200
                      ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
        >
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center
                       shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause size={14} strokeWidth={2.5} className="text-black" />
            ) : (
              <Play size={14} strokeWidth={2.5} className="text-black ml-0.5" />
            )}
          </button>
        </div>

        {/* Clip number badge */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-0.5">
          <span className="text-[10px] font-semibold font-mono text-white tracking-wide">
            #{String(clip.index).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Clip info + download */}
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--clivo-text-primary)] truncate tracking-tight">
            {clip.filename}
          </p>
          <p className="text-[10px] text-[var(--clivo-text-tertiary)] mt-0.5 font-mono">
            {formatTime(clip.duration)} · {clip.size}
          </p>
        </div>

        <button
          onClick={handleDownload}
          className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center
                      transition-all duration-200
                      ${
                        downloaded
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
                          : "border-[var(--clivo-border)] hover:border-[var(--clivo-border-hover)] hover:bg-[var(--clivo-muted)] text-[var(--clivo-text-secondary)]"
                      }`}
          aria-label="Download clip"
        >
          {downloaded ? (
            <CheckCircle2 size={13} strokeWidth={2} />
          ) : (
            <Download size={13} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}

export default function ClipsResultScreen({
  result,
  meta,
  onReset,
}: ClipsResultScreenProps) {
  const handleDownloadAll = () => {
    // Real: trigger zip download from result.zipUrl
    const a = document.createElement("a");
    a.href = result.zipUrl;
    a.download = "clivo_clips.zip";
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="w-full mx-auto animate-fadeUp">
      {/* ── Success header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
              <CheckCircle2
                size={14}
                strokeWidth={2.5}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
              Processing complete
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--clivo-text-primary)] leading-tight mb-1.5">
            Your clips are ready.
          </h1>
          <p className="text-sm text-[var(--clivo-text-secondary)]">
            {result.clips.length} clips generated from{" "}
            {formatTime(result.totalDuration)} of video.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 h-10 rounded-xl border border-(--clivo-border)
                       bg-(--clivo-surface) text-(--clivo-text-primary) text-sm font-semibold
                       hover:border-(--clivo-border-hover) hover:bg-(--clivo-muted)
                       active:scale-[0.98] transition-all duration-150"
          >
            <RotateCcw size={13} strokeWidth={2.2} />
            New video
          </button>

          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-2 px-4 h-10 rounded-xl
                       bg-(--clivo-text-primary) text-(--clivo-bg) text-sm font-semibold
                       hover:opacity-90 active:scale-[0.98] transition-all duration-150"
          >
            <Archive size={13} strokeWidth={2.2} />
            Download all
          </button>
        </div>
      </div>

      {/* ── Summary chips ── */}
      <div className="flex items-center gap-6 mb-7 flex-wrap">
        {[
          { label: "Clips generated", value: String(result.clips.length) },
          { label: "Total duration", value: formatTime(result.totalDuration) },
          { label: "Interval used", value: formatTime(meta.interval) },
          { label: "Source file", value: meta.file.name },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-(--clivo-surface) border border-(--clivo-border)
                       rounded-xl px-3.5 py-2"
          >
            <span className="text-[10px] text-(--clivo-text-tertiary) uppercase tracking-wide font-medium">
              {label}
            </span>
            <span className="text-xs font-semibold font-mono text-(--clivo-text-primary) tracking-tight truncate max-w-30">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Clip grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {result.clips.map((clip, i) => (
          <ClipCard key={clip.id} clip={clip} index={i} />
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-(--clivo-text-secondary)
                     hover:text-(--clivo-text-primary) transition-colors duration-150"
        >
          <Scissors size={13} strokeWidth={2} />
          Generate new clips
        </button>
      </div>
    </div>
  );
}
