export type AppScreen = "upload" | "processing" | "complete";

export type ProcessingStage = "upload" | "processing" | "complete";

export interface StageInfo {
  id: ProcessingStage;
  label: string;
  description: string;
}

export interface ClipResult {
  id: string;
  filename: string;
  url: string; // mocked blob / CDN URL
  duration: number; // seconds
  index: number; // clip number (1-based)
  size: string; // e.g. "14.2 MB"
}

export interface ProcessingResult {
  clips: ClipResult[];
  totalDuration: number;
  zipUrl: string;
}

export interface VideoMeta {
  file: File;
  duration: number; // seconds
  interval: number; // seconds
  estimatedClips: number;
}
