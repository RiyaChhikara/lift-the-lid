"use client";

import { useState } from "react";

type Props = {
  photoUrl: string;
  sketchUrl?: string | null;
  name: string;
  loading?: boolean;
};

export function SketchCompare({ photoUrl, sketchUrl, name, loading }: Props) {
  const [showSketch, setShowSketch] = useState(false);
  const canToggle = Boolean(sketchUrl);

  return (
    <section className="mt-14 max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">See it another way</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Industrial design sketch</h2>
          <p className="mt-2 text-sm text-mist">
            Super Normal line work — the object as a field-guide plate.
          </p>
        </div>
        {canToggle && (
          <button
            type="button"
            onClick={() => setShowSketch((v) => !v)}
            className="shrink-0 text-sm text-brass transition hover:text-brass-soft"
          >
            {showSketch ? "Show photo" : "Show sketch"}
          </button>
        )}
      </div>
      <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-graphite-700 bg-graphite-800 shadow-glow sm:aspect-[5/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={showSketch && sketchUrl ? sketchUrl : photoUrl}
          alt={showSketch ? `Industrial design sketch of ${name}` : name}
          className="h-full w-full object-cover transition duration-500"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-graphite-950/55 backdrop-blur-[2px]">
            <p className="animate-pulse-soft text-sm tracking-wide text-aluminum">
              Drawing the sketch…
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
