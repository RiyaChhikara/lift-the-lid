"use client";

import { useRef } from "react";

type Props = {
  onFile: (file: File) => void;
  label?: string;
  className?: string;
};

export function ScanButton({
  onFile,
  label = "Scan an object",
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`inline-flex items-center justify-center rounded-full bg-brass px-7 py-3.5 text-sm font-medium tracking-wide text-graphite-950 transition hover:bg-brass-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass ${className}`}
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </>
  );
}
