import Image from "next/image";
import Link from "next/link";
import type { PublicScan } from "@/lib/types";

export function GalleryGrid({
  scans,
  compact = false,
}: {
  scans: PublicScan[];
  compact?: boolean;
}) {
  if (scans.length === 0) {
    return (
      <p className={compact ? "mt-6 text-sm text-mist" : "mt-10 text-mist"}>
        No public scans yet.{" "}
        <Link href="/scan" className="text-brass hover:text-brass-soft">
          Be the first to lift a lid.
        </Link>
      </p>
    );
  }

  return (
    <div
      className={
        compact
          ? "mt-6 grid gap-4 sm:grid-cols-2"
          : "mt-10 grid gap-6 sm:grid-cols-2"
      }
    >
      {scans.map((scan) => (
        <Link key={scan.id} href={`/s/${scan.id}`} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-graphite-700 bg-graphite-800">
            {scan.image_url ? (
              <Image
                src={scan.image_url}
                alt={scan.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, 50vw"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-mist">
                {scan.name}
              </div>
            )}
          </div>
          <div className="px-1 pt-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-aluminum-muted">Shared field note</p>
            <h2 className="mt-2 font-display text-xl text-ink">{scan.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-mist">{scan.story.hook}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
