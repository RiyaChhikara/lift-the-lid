"use client";

import Image from "next/image";
import Link from "next/link";
import type { DemoEntry } from "@/lib/types";

export function DemoCards({ demos }: { demos: DemoEntry[] }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 pb-16">
      <h2 className="font-display text-2xl text-ink">Try an object</h2>
      <p className="mt-2 max-w-md text-sm text-mist">
        Pre-written teardowns — no API required.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {demos.map((demo, i) => (
          <Link
            key={demo.id}
            href={`/scan?demo=${demo.id}`}
            className="group animate-reveal block"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-graphite-800">
              <Image
                src={demo.image}
                alt={demo.story.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <h3 className="mt-3 font-display text-lg text-ink">{demo.story.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-mist">{demo.story.hook}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
