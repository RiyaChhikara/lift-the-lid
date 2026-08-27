"use client";

import { useEffect, useState } from "react";
import { GalleryGrid } from "@/components/GalleryGrid";
import type { PublicScan } from "@/lib/types";

type Props = {
  limit?: number;
  compact?: boolean;
};

export function PublicGallery({ limit, compact = false }: Props) {
  const [scans, setScans] = useState<PublicScan[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/scans", { cache: "no-store" });
        const data = (await res.json()) as {
          scans?: PublicScan[];
          configured?: boolean;
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Could not load gallery");
          setScans([]);
          setConfigured(data.configured ?? true);
          return;
        }
        setError(null);
        setConfigured(data.configured ?? true);
        setScans(limit ? (data.scans ?? []).slice(0, limit) : data.scans ?? []);
      } catch {
        if (!cancelled) {
          setError("The public gallery is unavailable right now. Scans still work on your shelf.");
          setScans([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [attempt, limit]);

  if (loading) {
    return <p className={compact ? "mt-6 text-sm text-mist" : "mt-10 text-mist"}>Loading gallery…</p>;
  }

  if (!configured) {
    return (
      <div className={`${compact ? "mt-6" : "mt-10"} gallery-status`}>
        <p className="text-xs uppercase tracking-[0.18em] text-brass">Private for now</p>
        <p className="mt-2 text-sm text-mist">
          Gallery storage is not configured yet. Scans still work on your shelf.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${compact ? "mt-6" : "mt-10"} gallery-status`} role="status">
        <p className="text-xs uppercase tracking-[0.18em] text-brass">Gallery paused</p>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-mist">{error}</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError(null);
            setAttempt((current) => current + 1);
          }}
          className="mt-4 text-sm text-brass transition hover:text-brass-soft"
        >
          Try again →
        </button>
      </div>
    );
  }

  return <GalleryGrid scans={scans} compact={compact} />;
}
