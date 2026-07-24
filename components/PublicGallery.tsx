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
          return;
        }
        setConfigured(data.configured ?? true);
        setScans(limit ? (data.scans ?? []).slice(0, limit) : data.scans ?? []);
      } catch {
        if (!cancelled) setError("Could not load gallery");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  if (loading) {
    return <p className={compact ? "mt-6 text-sm text-mist" : "mt-10 text-mist"}>Loading gallery…</p>;
  }

  if (!configured) {
    return (
      <p className="mt-6 text-sm text-brass">
        Gallery storage is not configured yet. Scans still work on your shelf.
      </p>
    );
  }

  if (error) {
    return <p className="mt-6 text-sm text-red-300">{error}</p>;
  }

  return <GalleryGrid scans={scans} compact={compact} />;
}
