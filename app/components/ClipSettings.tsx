"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Scissors, Film, ChevronUp, ChevronDown } from "lucide-react";

const MIN_INTERVAL = 6;
const MAX_INTERVAL = 300;
const RECOMMENDED_MAX_LABEL = "5m";

interface ClipSettingsProps {
  file: File | null;
  onIntervalChange?: (seconds: number) => void;
}

const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("video/")) {
      reject(new Error("Not a video file"));
      return;
    }
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
        reject(new Error("Failed to load video"));
      },
      { once: true },
    );
    video.load();
  });
};

const formatTime = (seconds: number) => {
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs > 0 ? secs + "s" : ""}`.trim();
  return `${secs}s`;
};

/* ── StatCard ───────────────────────────────────────────────────────────── */

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="p-5 rounded-xl border border-(--clivo-border) bg-(--clivo-surface) animate-fadeUp">
    <div className="flex items-center gap-2 mb-3.5">
      <Icon
        size={15}
        strokeWidth={1.8}
        className="text-(--clivo-text-tertiary) shrink-0"
      />
      <span className="text-[11px] font-medium uppercase tracking-wider text-(--clivo-text-tertiary)">
        {label}
      </span>
    </div>
    <p className="text-[28px] font-semibold leading-none tracking-[-0.04em] font-mono text-(--clivo-text-primary)">
      {value}
    </p>
  </div>
);

/* ── ClipSettings ───────────────────────────────────────────────────────── */

const ClipSettings: React.FC<ClipSettingsProps> = ({
  file,
  onIntervalChange,
}) => {
  const [interval, setIntervalRaw] = useState(60);
  const [duration, setDuration] = useState(0);
  const [inputValue, setInputValue] = useState("60");
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const commit = (val: number) => {
    const clamped = Math.min(
      MAX_INTERVAL,
      Math.max(MIN_INTERVAL, Math.round(val)),
    );
    setIntervalRaw(clamped);
    setInputValue(String(clamped));
    onIntervalChange?.(clamped);
  };

  useEffect(() => {
    onIntervalChange?.(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!file) return;
    getVideoDuration(file).then(setDuration).catch(console.error);
  }, [file]);

  const estimatedClips = useMemo(
    () => (duration > 0 ? Math.ceil(duration / interval) : 0),
    [duration, interval],
  );

  const fillPct = Math.round(
    ((interval - MIN_INTERVAL) / (MAX_INTERVAL - MIN_INTERVAL)) * 100,
  );

  const startHold = (delta: number) => {
    commit(interval + delta);
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => {
        setIntervalRaw((prev) => {
          const next = Math.min(
            MAX_INTERVAL,
            Math.max(MIN_INTERVAL, prev + delta),
          );
          setInputValue(String(next));
          onIntervalChange?.(next);
          return next;
        });
      }, 80);
    }, 400);
  };

  const stopHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
  };

  const atMin = interval <= MIN_INTERVAL;
  const atMax = interval >= MAX_INTERVAL;
  const overSoftMax = interval > MAX_INTERVAL * 0.8;
  const tooManyClips = estimatedClips > 20 && duration > 0 && !overSoftMax;

  return (
    <div className="w-full animate-fadeUp">
      {/* ── Header row ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-(--clivo-text-primary) mb-0.5">
            Clip interval
          </h2>
          <p className="text-xs text-(--clivo-text-tertiary)">
            How long each clip should be
          </p>
        </div>

        {/* ── Stepper ── */}
        <div className="flex items-center border border-(--clivo-border) rounded-xl bg-(--clivo-muted) overflow-hidden">
          {/* Decrease */}
          <button
            aria-label="Decrease interval"
            disabled={atMin}
            onMouseDown={() => startHold(-1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => startHold(-1)}
            onTouchEnd={stopHold}
            className="w-8 h-9 flex items-center justify-center shrink-0 border-none bg-transparent transition-colors duration-150 disabled:cursor-not-allowed disabled:text-(--clivo-text-tertiary) text-(--clivo-text-primary) hover:bg-(--clivo-muted-2) cursor-pointer"
          >
            <ChevronDown size={14} strokeWidth={2.5} />
          </button>

          {/* Input */}
          <input
            type="number"
            min={MIN_INTERVAL}
            max={MAX_INTERVAL}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              const parsed = parseInt(inputValue, 10);
              commit(isNaN(parsed) ? interval : parsed);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const parsed = parseInt(inputValue, 10);
                commit(isNaN(parsed) ? interval : parsed);
                (e.target as HTMLInputElement).blur();
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                commit(interval + 1);
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                commit(interval - 1);
              }
            }}
            className="w-14 h-9 text-center text-[13px] font-semibold font-mono
                       text-(--clivo-text-primary) bg-(--clivo-surface)
                       border-x border-(--clivo-border)
                       outline-none focus:outline-none
                       [appearance:textfield]
                       [&::-webkit-outer-spin-button]:appearance-none
                       [&::-webkit-inner-spin-button]:appearance-none"
          />

          {/* Increase */}
          <button
            aria-label="Increase interval"
            disabled={atMax}
            onMouseDown={() => startHold(1)}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={() => startHold(1)}
            onTouchEnd={stopHold}
            className="w-8 h-9 flex items-center justify-center shrink-0 border-none bg-transparent transition-colors duration-150 disabled:cursor-not-allowed disabled:text-(--clivo-text-tertiary) text-(--clivo-text-primary) hover:bg-(--clivo-muted-2) cursor-pointer"
          >
            <ChevronUp size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── Progress track ── */}
      <div className="h-0.75 rounded-full bg-(--clivo-muted-2) mb-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-(--clivo-text-primary) transition-[width] duration-150 ease-out"
          style={{ width: `${fillPct}%` }}
        />
      </div>

      {/* ── Track labels ── */}
      <div className="flex justify-between text-[11px] font-mono text-(--clivo-text-tertiary) mb-6">
        <span>{MIN_INTERVAL}s</span>
        <span>Recommended max: {RECOMMENDED_MAX_LABEL}</span>
        <span>{formatTime(MAX_INTERVAL)}</span>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <StatCard
          icon={Scissors}
          label="Clips"
          value={duration > 0 ? String(estimatedClips) : "—"}
        />
        <StatCard
          icon={Film}
          label="Duration"
          value={duration > 0 ? formatTime(duration) : "—"}
        />
      </div>

      {/* ── Hint: over soft max ── */}
      {overSoftMax && (
        <div className="px-4 py-3 rounded-lg border border-(--clivo-border) bg-(--clivo-muted) text-xs text-(--clivo-text-secondary) leading-relaxed animate-fadeIn">
          ⚠️ Intervals above {formatTime(MAX_INTERVAL * 0.8)} produce very few
          clips. Consider going shorter.
        </div>
      )}

      {/* ── Hint: too many clips ── */}
      {tooManyClips && (
        <div className="px-4 py-3 rounded-lg border border-(--clivo-border) bg-(--clivo-muted) text-xs text-(--clivo-text-secondary) leading-relaxed animate-fadeIn">
          ⚡ {estimatedClips} clips will take longer to process. Consider a
          larger interval.
        </div>
      )}
    </div>
  );
};

export default ClipSettings;
