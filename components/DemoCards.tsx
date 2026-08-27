"use client";

import Image from "next/image";
import Link from "next/link";
import type { DemoEntry } from "@/lib/types";

export function DemoCards({ demos }: { demos: DemoEntry[] }) {
  return (
    <section className="mx-auto w-full max-w-4xl px-5 pb-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Start here</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Try an object</h2>
        </div>
        <span className="hidden text-xs text-aluminum-muted sm:inline">Three ready-made rabbit holes</span>
      </div>
      <p className="mt-2 max-w-md text-sm text-mist">
        Pre-written teardowns — no API required.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {demos.map((demo, i) => (
          <Link
            key={demo.id}
            href={`/scan?demo=${demo.id}`}
            className="group animate-reveal block rounded-[1.25rem] border border-graphite-700 bg-graphite-900/45 p-2 transition hover:-translate-y-1 hover:border-brass/50"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-graphite-800">
              <Image
                src={demo.image}
                alt={demo.story.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <div className="px-2 pb-2 pt-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-aluminum-muted">
                0{i + 1} / open the lid
              </p>
              <h3 className="mt-2 font-display text-lg text-ink">{demo.story.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-mist">{demo.story.hook}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
