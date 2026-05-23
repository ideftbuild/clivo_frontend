"use client";

import { useState, useCallback } from "react";
import { Scissors } from "lucide-react";

import UploadInput from "./UploadInput";
import ClipSettings from "./ClipSettings";
import ProcessingScreen from "./ProcessingScreen";
import ClipsResultScreen from "./ClipsResultScreen";

import type { AppScreen, VideoMeta, ProcessingResult } from "../types/clivo";
import { generateClipsMock } from "../lib/mockApi";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.src = "";
    };

    video.addEventListener(
      "loadedmetadata",
      () => {
        const d = video.duration;
        cleanup();
        if (!isFinite(d) || isNaN(d)) {
          reject(new Error("Could not read duration"));
          return;
        }
        resolve(d);
      },
      { once: true },
    );
    video.addEventListener(
      "error",
      () => {
        cleanup();
        reject(new Error("Load failed"));
      },
      { once: true },
    );
    video.load();
  });
}

/* ─── Spinner ────────────────────────────────────────────────────────────── */

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeOpacity="0.25"
      />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Screen 1: Upload + settings ────────────────────────────────────────── */

interface UploadScreenProps {
  onGenerate: (file: File, interval: number) => void;
}

function UploadScreen({ onGenerate }: UploadScreenProps) {
  const [file, setFile] = useState<File | null>(null);
  const [interval, setInterval] = useState(60);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    // Small artificial delay so the button state is visible
    await new Promise((r) => setTimeout(r, 400));
    onGenerate(file, interval);
  };

  return (
    <div className="w-full mx-auto pb-20 animate-fadeUp">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1
          className="text-[clamp(28px,5vw,42px)] font-semibold tracking-[-0.04em] leading-[1.15]
                        text-[var(--clivo-text-primary)] mb-2.5"
        >
          Split your video
          <br />
          into clips.
        </h1>
        <p className="text-sm text-[var(--clivo-text-secondary)] leading-relaxed">
          Upload a video, choose your interval, and download
          <br className="hidden sm:block" />
          clean clips — no account needed.
        </p>
      </div>

      {/* Card */}
      <div
        className="bg-[var(--clivo-surface)] border border-[var(--clivo-border)]
                   rounded-[var(--clivo-radius-xl)] shadow-[var(--clivo-shadow-md)]
                   p-7 flex flex-col gap-6"
      >
        <UploadInput
          onUpload={setFile}
          fileName={file?.name}
          onClear={() => setFile(null)}
        />

        {file && (
          <div className="h-px bg-[var(--clivo-border)] -mx-1 animate-fadeIn" />
        )}

        <div
          className="transition-opacity duration-300"
          style={{
            opacity: file ? 1 : 0.4,
            pointerEvents: file ? "auto" : "none",
          }}
        >
          <ClipSettings file={file} />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!file || loading}
          className={`
            w-full h-13 rounded-[var(--clivo-radius-md)] text-sm font-semibold
            flex items-center justify-center gap-2 transition-all duration-200
            active:scale-[0.99] disabled:cursor-not-allowed
            ${
              !file || loading
                ? "bg-[var(--clivo-muted-2)] text-[var(--clivo-text-tertiary)]"
                : "bg-[var(--clivo-text-primary)] text-[var(--clivo-bg)] hover:scale-[1.01] hover:shadow-[var(--clivo-shadow-md)]"
            }
          `}
        >
          {loading ? (
            <>
              <Spinner /> Preparing…
            </>
          ) : (
            <>
              <Scissors size={15} strokeWidth={2} /> Generate clips
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── VideoSplit orchestrator ─────────────────────────────────────────────── */

export default function VideoSplit() {
  const [screen, setScreen] = useState<AppScreen>("upload");
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"upload" | "processing" | "complete">(
    "upload",
  );
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const handleGenerate = useCallback(async (file: File, interval: number) => {
    // 1. Read duration
    let duration = 0;
    try {
      duration = await getVideoDuration(file);
    } catch {
      // fallback: treat as unknown duration → use 120 s for demo
      duration = 120;
    }

    const estimatedClips = Math.ceil(duration / interval);
    const videoMeta: VideoMeta = { file, duration, interval, estimatedClips };
    setMeta(videoMeta);

    // 2. Switch to processing screen, stage = upload
    setProgress(0);
    setStage("upload");
    setScreen("processing");

    // 3. Small delay then move to "processing" stage
    await new Promise((r) => setTimeout(r, 800));
    setStage("processing");

    // 4. Run mock API (updates progress 0→100)
    const res = await generateClipsMock(file.name, duration, interval, (pct) =>
      setProgress(pct),
    );

    // 5. Move to complete stage briefly, then switch screen
    setStage("complete");
    setResult(res);
    await new Promise((r) => setTimeout(r, 800));
    setScreen("complete");
  }, []);

  const handleReset = useCallback(() => {
    setScreen("upload");
    setMeta(null);
    setProgress(0);
    setStage("upload");
    setResult(null);
  }, []);

  // Wrap screens in a fade-key container so React re-mounts & re-animates
  const key = screen;

  return (
    <div key={key} className="w-full">
      {screen === "upload" && <UploadScreen onGenerate={handleGenerate} />}

      {screen === "processing" && meta && (
        <div className="mx-auto pb-20">
          <ProcessingScreen
            meta={meta}
            progress={progress}
            currentStage={stage}
          />
        </div>
      )}

      {screen === "complete" && result && meta && (
        <div className="w-full mx-auto pb-20">
          <ClipsResultScreen
            result={result}
            meta={meta}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
