"use client";

import { useEffect, useRef } from "react";
import { Film, Check, Loader2 } from "lucide-react";
import type { VideoMeta } from "../types/clivo";

interface ProcessingScreenProps {
  meta: VideoMeta;
  progress: number; // 0–100
  currentStage: "upload" | "processing" | "complete";
}

interface Stage {
  id: "upload" | "processing" | "complete";
  label: string;
  description: string;
}

const STAGES: Stage[] = [
  { id: "upload", label: "Upload", description: "File received" },
  {
    id: "processing",
    label: "Processing",
    description: "Splitting into clips",
  },
  { id: "complete", label: "Complete", description: "Clips ready" },
];

const stageIndex = (id: Stage["id"]) => STAGES.findIndex((s) => s.id === id);

function formatTime(s: number) {
  const total = Math.floor(s);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  if (m > 0) return sec > 0 ? `${m}m ${sec}s` : `${m}m`;
  return `${sec}s`;
}

export default function ProcessingScreen({
  meta,
  progress,
  currentStage,
}: ProcessingScreenProps) {
  const activeIdx = stageIndex(currentStage);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  const statusText =
    progress < 20
      ? "Analysing video structure…"
      : progress < 50
        ? "Splitting into clips…"
        : progress < 80
          ? "Encoding segments…"
          : progress < 100
            ? "Finalising…"
            : "Done!";

  return (
    <div className="w-full mx-auto animate-fadeUp">
      {/* ── Hero heading ── */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-(--clivo-text-primary) leading-tight mb-2">
          Processing your video
        </h1>
        <p className="text-sm text-(--clivo-text-secondary) leading-relaxed">
          Hang tight — we&apos;re splitting your video into{" "}
          {meta.estimatedClips} clips.
          <br className="hidden sm:block" /> This usually takes under a minute.
        </p>
      </div>

      {/* ── Stage tracker ── */}
      <div className="bg-(--clivo-surface) border border-(--clivo-border) rounded-2xl p-7 mb-4 shadow-(--clivo-shadow-md)">
        <div className="relative flex items-start justify-between">
          {/* Connecting line */}
          <div className="absolute top-4.5 left-[calc(16.6%)] right-[calc(16.6%)] h-px bg-(--clivo-muted-2) z-0" />
          {/* Filled portion */}
          <div
            className="absolute top-4.5 left-[calc(16.6%)] h-px bg-(--clivo-text-primary) z-0 transition-all duration-700 ease-out"
            style={{
              width: activeIdx === 0 ? "0%" : activeIdx === 1 ? "50%" : "68%",
            }}
          />

          {STAGES.map((stage, i) => {
            const isDone = i < activeIdx;
            const isActive = i === activeIdx;
            return (
              <div
                key={stage.id}
                className="relative z-10 flex flex-col items-center gap-2 flex-1"
              >
                {/* Circle */}
                <div
                  className={`
                    w-9 h-9 rounded-full border-2 flex items-center justify-center
                    transition-all duration-500
                    ${
                      isDone
                        ? "bg-(--clivo-text-primary) border-(--clivo-text-primary)"
                        : isActive
                          ? "bg-(--clivo-surface) border-(--clivo-text-primary) shadow-[0_0_0_4px_rgba(0,0,0,0.06)]"
                          : "bg-(--clivo-surface) border-(--clivo-muted-2)"
                    }
                  `}
                >
                  {isDone ? (
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      className="text-(--clivo-bg)"
                    />
                  ) : isActive ? (
                    <Loader2
                      size={14}
                      strokeWidth={2}
                      className="text-(--clivo-text-primary) animate-spin"
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-(--clivo-muted-2)" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-semibold tracking-tight transition-colors duration-300 ${
                    isDone || isActive
                      ? "text-(--clivo-text-primary)"
                      : "text-(--clivo-text-tertiary)"
                  }`}
                >
                  {stage.label}
                </span>
                <span className="text-[10px] text-(--clivo-text-tertiary) text-center leading-tight hidden sm:block">
                  {stage.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Video processing card ── */}
      <div className="bg-(--clivo-surface) border border-(--clivo-border) rounded-2xl p-6 shadow-(--clivo-shadow-sm)">
        {/* File info row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-(--clivo-muted) flex items-center justify-center shrink-0">
            <Film
              size={18}
              strokeWidth={1.8}
              className="text-(--clivo-text-primary)"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-(--clivo-text-primary) tracking-tight truncate">
              {meta.file.name}
            </p>
            <p className="text-xs text-(--clivo-text-tertiary) mt-0.5">
              {formatTime(meta.duration)} · {meta.estimatedClips} clips · every{" "}
              {formatTime(meta.interval)}
            </p>
          </div>
        </div>

        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { label: "Duration", value: formatTime(meta.duration) },
            { label: "Interval", value: formatTime(meta.interval) },
            { label: "Est. clips", value: String(meta.estimatedClips) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-(--clivo-muted) px-3 py-2.5 text-center"
            >
              <p className="text-[10px] font-medium text-(--clivo-text-tertiary) uppercase tracking-wide mb-1">
                {label}
              </p>
              <p className="text-sm font-semibold font-mono text-(--clivo-text-primary) tracking-tight">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-(--clivo-text-secondary)">
              {statusText}
            </p>
            <span className="text-xs font-semibold font-mono text-(--clivo-text-primary)">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-(--clivo-muted-2) overflow-hidden">
            <div
              ref={barRef}
              className="h-full rounded-full bg-(--clivo-text-primary) transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
