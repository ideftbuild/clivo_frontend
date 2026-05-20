"use client";

import { useEffect, useState, useMemo } from "react";
import { Scissors, Clock3, Film } from "lucide-react";

const MAX_INTERVAL = 300;

interface ClipSettingsProps {
  file: File | null;
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

const StatCard = ({
  icon: Icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay?: number;
}) => (
  <div
    style={{
      padding: "20px",
      borderRadius: "var(--clivo-radius-md)",
      border: "1px solid var(--clivo-border)",
      background: "var(--clivo-surface)",
      animation: `fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "14px",
      }}
    >
      <Icon
        size={15}
        style={{ color: "var(--clivo-text-tertiary)", strokeWidth: 1.8 }}
      />
      <span
        style={{
          fontSize: "12px",
          color: "var(--clivo-text-tertiary)",
          letterSpacing: "0.02em",
          fontWeight: 500,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
    <p
      style={{
        fontSize: "28px",
        fontWeight: 600,
        color: "var(--clivo-text-primary)",
        letterSpacing: "-0.04em",
        lineHeight: 1,
        fontFamily: "var(--clivo-mono)",
      }}
    >
      {value}
    </p>
  </div>
);

const ClipSettings: React.FC<ClipSettingsProps> = ({ file }) => {
  const [interval, setInterval] = useState(60);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!file) {
      setDuration(0);
      return;
    }
    getVideoDuration(file).then(setDuration).catch(console.error);
  }, [file]);

  const estimatedClips = useMemo(
    () => Math.ceil(duration / interval),
    [duration, interval],
  );

  // Progress fill for range track
  const fillPct = Math.round(((interval - 30) / (MAX_INTERVAL - 30)) * 100);

  return (
    <div
      style={{
        width: "100%",
        animation: "fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.1s both",
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--clivo-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "2px",
            }}
          >
            Clip interval
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "var(--clivo-text-tertiary)",
            }}
          >
            How long each clip should be
          </p>
        </div>
        <div
          style={{
            padding: "6px 14px",
            borderRadius: "99px",
            border: "1px solid var(--clivo-border)",
            background: "var(--clivo-muted)",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--clivo-text-primary)",
            fontFamily: "var(--clivo-mono)",
            letterSpacing: "-0.02em",
            minWidth: "60px",
            textAlign: "center",
          }}
        >
          {formatTime(interval)}
        </div>
      </div>

      {/* Range slider */}
      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input
          type="range"
          min={30}
          max={MAX_INTERVAL}
          step={30}
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          style={{
            width: "100%",
            background: `linear-gradient(to right, var(--clivo-text-primary) ${fillPct}%, var(--clivo-muted-2) ${fillPct}%)`,
            borderRadius: "99px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "var(--clivo-text-tertiary)",
          fontFamily: "var(--clivo-mono)",
          marginBottom: "24px",
        }}
      >
        <span>30s</span>
        <span>5m</span>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <StatCard
          icon={Scissors}
          label="Clips"
          value={duration > 0 ? String(estimatedClips) : "—"}
          delay={60}
        />
        <StatCard
          icon={Film}
          label="Duration"
          value={duration > 0 ? formatTime(duration) : "—"}
          delay={100}
        />
      </div>

      {/* Hint */}
      {estimatedClips > 10 && duration > 0 && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--clivo-radius-sm)",
            background: "var(--clivo-muted)",
            border: "1px solid var(--clivo-border)",
            fontSize: "12px",
            color: "var(--clivo-text-secondary)",
            lineHeight: 1.5,
            animation: "fadeIn 0.3s ease both",
          }}
        >
          ⚡ {estimatedClips} clips will take longer to process. Consider a
          larger interval.
        </div>
      )}
    </div>
  );
};

export default ClipSettings;
