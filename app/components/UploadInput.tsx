"use client";

import { Upload, Film, X } from "lucide-react";
import React, { useState, useCallback } from "react";

interface UploadInputProps {
  onUpload: (file: File) => void;
  fileName: string | undefined;
  onClear?: () => void;
}

const UploadInput: React.FC<UploadInputProps> = ({
  onUpload,
  fileName,
  onClear,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("video/")) {
        onUpload(file);
      }
    },
    [onUpload],
  );

  /* ---------------- FILE SELECTED STATE ---------------- */
  if (fileName) {
    return (
      <div className="w-full p-5 md:p-6 rounded-(--clivo-radius-lg) border border-(--clivo-border) bg-(--clivo-surface)] flex items-center gap-4 animate-[fadeUp_0.35s_cubic-bezier(0.22,1,0.36,1)]">
        {/* Icon */}
        <div className="w-11 h-11 rounded-(--clivo-radius-sm) bg-(--clivo-muted) flex items-center justify-center shrink-0">
          <Film size={18} className="text-(--clivo-text-primary)" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-(--clivo-text-primary) truncate tracking-[-0.01em]">
            {fileName}
          </p>
          <p className="text-xs text-(--clivo-text-tertiary) mt-0.5">
            Video ready to split
          </p>
        </div>

        {/* Clear */}
        {onClear && (
          <button
            onClick={onClear}
            aria-label="Remove file"
            className="w-8 h-8 rounded-full border border-(--clivo-border) text-(--clivo-text-secondary) flex items-center justify-center transition-colors hover:bg-(--clivo-muted) hover:border-(--clivo-border-hover)"
          >
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>
    );
  }

  /* ---------------- UPLOAD STATE ---------------- */
  return (
    <label
      htmlFor="video-upload"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        "relative w-full min-h-65 p-12 md:p-14 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden",
        "rounded-(--clivo-radius-xl) border-[1.5px] transition-all duration-200",
        isDragging
          ? "bg-(--clivo-muted) border-(--clivo-text-primary)"
          : "bg-(--clivo-surface) border-(--clivo-border-hover)",
      ].join(" ")}
    >
      {/* Corner accents */}
      <span
        className="absolute top-4 left-4 w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-(--clivo-border-hover) rounded-tl-sm transition-opacity"
        style={{ opacity: isDragging ? 1 : 0.5 }}
      />
      <span
        className="absolute top-4 right-4 w-5 h-5 border-t-[1.5px] border-r-[1.5px] border-(--clivo-border-hover) rounded-tr-sm transition-opacity"
        style={{ opacity: isDragging ? 1 : 0.5 }}
      />
      <span
        className="absolute bottom-4 left-4 w-5 h-5 border-b-[1.5px] border-l-[1.5px] border-(--clivo-border-hover) rounded-bl-sm transition-opacity"
        style={{ opacity: isDragging ? 1 : 0.5 }}
      />
      <span
        className="absolute bottom-4 right-4 w-5 h-5 border-b-[1.5px] border-r-[1.5px] border-(--clivo-border-hover) rounded-br-sm transition-opacity"
        style={{ opacity: isDragging ? 1 : 0.5 }}
      />

      {/* Icon */}
      <div
        className={[
          "w-14 h-14 mb-5 rounded-(--clivo-radius-md) border border-(--clivo-border) bg-(--clivo-surface-raised) flex items-center justify-center shadow-sm transition-transform duration-200",
          isDragging ? "scale-105" : "scale-100",
        ].join(" ")}
      >
        <Upload
          size={22}
          className={[
            "text-(--clivo-text-primary) transition-transform duration-200",
            isDragging ? "-translate-y-0.5" : "translate-y-0",
          ].join(" ")}
        />
      </div>

      {/* Text */}
      <p className="text-base font-semibold text-(--clivo-text-primary) tracking-[-0.02em] mb-1.5">
        {isDragging ? "Drop to upload" : "Upload your video"}
      </p>

      <p className="text-sm text-(--clivo-text-secondary) mb-1">
        Drag & drop or click to browse
      </p>

      <p className="text-xs text-(--clivo-text-tertiary) font-mono tracking-[0.02em]">
        MP4 · MOV · AVI · up to 2 GB
      </p>

      {/* Input */}
      <input
        id="video-upload"
        type="file"
        accept="video/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
      />
    </label>
  );
};

export default UploadInput;
