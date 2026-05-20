"use client";

import UploadInput from "./UploadInput";
import ClipSettings from "./ClipSettings";
import { useState } from "react";
import { Scissors } from "lucide-react";

const VideoSplit = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleClear = () => {
    setFile(null);
    setDone(false);
  };

  const handleGenerate = async () => {
    if (!file) return;
    setIsProcessing(true);

    await new Promise((r) => setTimeout(r, 2000));

    setIsProcessing(false);
    setDone(true);
  };

  return (
    <div className="mx-auto pb-20 px-0">
      {/* Header */}
      <div
        className="text-center mb-10"
        style={{
          animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <h1 className="text-[28px] md:text-[42px] font-semibold tracking-[-0.04em] leading-[1.15] text-[var(--clivo-text-primary)] mb-2.5">
          Split your video
          <br />
          into clips.
        </h1>

        <p className="text-[15px] leading-relaxed text-[var(--clivo-text-secondary)]">
          Upload a video, choose your interval, and download
          <br />
          clean clips — no account needed.
        </p>
      </div>

      {/* Main card */}
      <div
        className="bg-[var(--clivo-surface)] border border-[var(--clivo-border)] rounded-[var(--clivo-radius-xl)] shadow-[var(--clivo-shadow-md)] p-7 flex flex-col gap-6"
        style={{
          animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.07s both",
        }}
      >
        {/* Upload */}
        <UploadInput
          onUpload={setFile}
          fileName={file?.name}
          onClear={handleClear}
        />

        {/* Divider */}
        {file && (
          <div
            className="h-px bg-[var(--clivo-border)] -mx-1"
            style={{ animation: "fadeIn 0.3s ease both" }}
          />
        )}

        {/* Clip settings */}
        <div
          className="transition-opacity duration-300"
          style={{
            opacity: file ? 1 : 0.4,
            pointerEvents: file ? "auto" : "none",
          }}
        >
          <ClipSettings file={file} />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!file || isProcessing}
          className={[
            "w-full h-[52px] rounded-[var(--clivo-radius-md)] flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em] transition-all duration-200",
            !file || isProcessing
              ? "cursor-not-allowed"
              : "cursor-pointer hover:scale-[1.01] active:scale-[0.99] hover:shadow-md",
          ].join(" ")}
          style={{
            background: done
              ? "var(--clivo-muted)"
              : isProcessing
                ? "var(--clivo-muted-2)"
                : "var(--clivo-text-primary)",
            color: done
              ? "var(--clivo-text-secondary)"
              : isProcessing
                ? "var(--clivo-text-secondary)"
                : "var(--clivo-bg)",
          }}
        >
          {isProcessing ? (
            <>
              <ProcessingSpinner />
              Processing…
            </>
          ) : done ? (
            "✓ Clips ready — download below"
          ) : (
            <>
              <Scissors size={15} strokeWidth={2} />
              Generate clips
            </>
          )}
        </button>

        {/* Download area */}
        {done && (
          <div
            className="p-5 text-center rounded-[var(--clivo-radius-md)] border border-[var(--clivo-border)] bg-[var(--clivo-muted)]"
            style={{
              animation: "fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <p className="text-[13px] text-[var(--clivo-text-secondary)] mb-3">
              Your clips are ready to download.
            </p>

            <button className="px-6 py-2.5 rounded-[var(--clivo-radius-sm)] border border-[var(--clivo-border-hover)] bg-[var(--clivo-surface)] text-[13px] font-semibold tracking-[-0.01em] text-[var(--clivo-text-primary)] hover:bg-[var(--clivo-muted)] transition-colors">
              Download all clips
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- Spinner ---------------- */
const ProcessingSpinner = () => (
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

export default VideoSplit;
