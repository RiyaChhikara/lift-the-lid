import demosData from "@/data/demos.json";
import { Hero } from "@/components/Hero";
import { DemoCards } from "@/components/DemoCards";
import { PublicGallery } from "@/components/PublicGallery";
import { ShelfStrip } from "@/components/ShelfStrip";
import { WaitlistFooter } from "@/components/WaitlistFooter";
import Link from "next/link";
import type { DemoEntry } from "@/lib/types";

export default function HomePage() {
  const demos = demosData.demos as DemoEntry[];

  return (
    <>
      <Hero />
      <DemoCards demos={demos} />
      <ShelfStrip />
      <section className="mx-auto w-full max-w-4xl px-5 pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brass">Shared shelf</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Public gallery</h2>
            <p className="mt-2 max-w-md text-sm text-mist">
              Shared teardowns from people looking closer at the ordinary.
            </p>
          </div>
          <Link
            href="/gallery"
            className="shrink-0 text-sm text-brass transition hover:text-brass-soft"
          >
            View all →
          </Link>
        </div>
        <PublicGallery limit={4} compact />
      </section>
      <WaitlistFooter />
    </>
  );
}
