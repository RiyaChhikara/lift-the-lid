"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearShelf, readShelf } from "@/lib/shelf";
import type { ShelfItem } from "@/lib/types";

const VISIBLE = 5;

export function ShelfStrip() {
  const [items, setItems] = useState<ShelfItem[]>([]);

  useEffect(() => {
    setItems(readShelf());
  }, []);

  if (items.length === 0) return null;

  const visible = items.slice(0, VISIBLE);
  const overflow = items.length - visible.length;

  return (
    <section className="mx-auto w-full max-w-3xl px-5 pb-12">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-ink">Your shelf</h2>
          <p className="mt-1 text-xs text-mist">Saved on this device only.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearShelf();
            setItems([]);
          }}
          className="text-xs text-mist transition hover:text-ink"
        >
          Clear
        </button>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visible.map((item) => {
          const href = item.publicId ? `/s/${item.publicId}` : "/scan";
          return (
            <Link
              key={item.id}
              href={href}
              className="w-24 shrink-0"
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
                  <div className="flex h-full items-center justify-center px-1 text-center text-[10px] leading-tight text-mist">
                    {item.name}
                  </div>
                )}
              </div>
              <p className="mt-1.5 truncate text-xs text-ink">{item.name}</p>
            </Link>
          );
        })}
        {overflow > 0 && (
          <div className="flex w-16 shrink-0 items-center justify-center text-xs text-mist">
            +{overflow} more
          </div>
        )}
      </div>
    </section>
  );
}
