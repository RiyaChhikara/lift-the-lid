"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readShelf } from "@/lib/shelf";
import type { ShelfItem } from "@/lib/types";

export function ShelfStrip() {
  const [items, setItems] = useState<ShelfItem[]>([]);

  useEffect(() => {
    setItems(readShelf());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-3xl px-5 pb-16">
      <h2 className="font-display text-2xl text-ink">Your shelf</h2>
      <p className="mt-2 text-sm text-mist">Saved on this device.</p>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => {
          const href = item.publicId ? `/s/${item.publicId}` : "/scan";
          return (
            <Link
              key={item.id}
              href={href}
              className="w-36 shrink-0"
            >
              <div className="relative aspect-square overflow-hidden rounded-sm bg-graphite-800">
                {item.imageDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageDataUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-mist">
                    {item.name}
                  </div>
                )}
              </div>
              <p className="mt-2 truncate font-display text-sm text-ink">{item.name}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
