const SHELF_KEY = "lift-the-lid:shelf";
const MAX_ITEMS = 24;

import type { ShelfItem } from "./types";

export function readShelf(): ShelfItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHELF_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ShelfItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeShelf(items: ShelfItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SHELF_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function addToShelf(item: ShelfItem): ShelfItem[] {
  const next = [item, ...readShelf().filter((x) => x.id !== item.id)].slice(0, MAX_ITEMS);
  writeShelf(next);
  return next;
}
