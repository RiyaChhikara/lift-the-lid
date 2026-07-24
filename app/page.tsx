import demosData from "@/data/demos.json";
import { Hero } from "@/components/Hero";
import { DemoCards } from "@/components/DemoCards";
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
      <section className="mx-auto w-full max-w-3xl px-5 pb-16">
        <h2 className="font-display text-2xl text-ink">Public gallery</h2>
        <p className="mt-2 max-w-md text-sm text-mist">
          Shared teardowns from other people looking closer at the ordinary.
        </p>
        <Link
          href="/gallery"
          className="mt-6 inline-flex text-sm text-brass transition hover:text-brass-soft"
        >
          Browse the gallery →
        </Link>
      </section>
      <WaitlistFooter />
    </>
  );
}
