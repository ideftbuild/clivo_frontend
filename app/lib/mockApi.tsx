import type { ClipResult, ProcessingResult } from "../types/clivo";

/** Simulates the full clip-generation pipeline. Resolves after ~6 s. */
export async function generateClipsMock(
  fileName: string,
  duration: number,
  interval: number,
  onProgress: (pct: number) => void,
): Promise<ProcessingResult> {
  const estimatedClips = Math.ceil(duration / interval);
  const stepMs = 6000 / 100; // ~60 ms per %

  for (let i = 0; i <= 100; i++) {
    await delay(stepMs);
    onProgress(i);
  }

  const clips: ClipResult[] = Array.from({ length: estimatedClips }, (_, i) => {
    const start = i * interval;
    const end = Math.min(start + interval, duration);
    const clipDuration = end - start;
    const baseName = stripExtension(fileName);

    return {
      id: `clip-${i + 1}`,
      filename: `${baseName}_clip_${String(i + 1).padStart(2, "0")}.mp4`,
      // Real URL: replace with presigned S3 / CDN url from your API
      url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
      duration: clipDuration,
      index: i + 1,
      size: `${(clipDuration * 1.4).toFixed(1)} MB`,
    };
  });

  return {
    clips,
    totalDuration: duration,
    zipUrl: "https://example.com/clips.zip", // mocked
  };
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function stripExtension(name: string) {
  return name.replace(/\.[^.]+$/, "");
}
