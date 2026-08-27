"use client";

import { useEffect, useState } from "react";
import type { WikimediaReferences } from "@/lib/types";

type Props = {
  objectName: string;
};

type LoadState = "loading" | "ready" | "empty" | "error";

const stickerStyles = ["sticker--apricot", "sticker--sage", "sticker--lilac", "sticker--lemon"];

export function WikimediaStickers({ objectName }: Props) {
  const [references, setReferences] = useState<WikimediaReferences | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReferences() {
      setState("loading");
      try {
        const response = await fetch(`/api/wikimedia?object=${encodeURIComponent(objectName)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = (await response.json()) as WikimediaReferences & { error?: string };
        if (!response.ok) throw new Error(data.error || "Reference search failed");
        if (controller.signal.aborted) return;
        setReferences(data);
        setState(data.wikipedia.length > 0 || data.commons.length > 0 ? "ready" : "empty");
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Wikimedia sticker search error", error);
          setState("error");
        }
      }
    }

    void loadReferences();
    return () => controller.abort();
  }, [attempt, objectName]);

  return (
    <section className="mt-16 rounded-[2rem] border border-graphite-700 bg-graphite-900/65 p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Reference trail</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-ink">
            Let Wikipedia take it from here
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
            Little signposts from Wikipedia and Wikimedia Commons. Lift the lid here,
            then follow the source when you want the full story.
          </p>
        </div>
        <span className="chip shrink-0 self-start sm:self-auto">pointer, not archive</span>
      </div>

      {state === "loading" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Loading reference stickers">
          {[0, 1, 2].map((index) => (
            <div className="sticker-skeleton" key={index} />
          ))}
        </div>
      )}

      {(state === "empty" || state === "error") && (
        <div className="mt-8 rounded-2xl border border-dashed border-graphite-700 px-5 py-5" role="status">
          <p className="text-sm leading-relaxed text-mist">
            {state === "empty"
              ? references?.error || "No matching stickers turned up yet."
              : "The reference trail is taking a little breather. Your scan still works."}
          </p>
          <button
            type="button"
            onClick={() => setAttempt((current) => current + 1)}
            className="mt-4 text-sm text-brass transition hover:text-brass-soft"
          >
            Try the trail again →
          </button>
        </div>
      )}

      {state === "ready" && references && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {references.wikipedia.map((page, index) => (
            <a
              key={page.url}
              href={page.url}
              target="_blank"
              rel="noreferrer"
              className={`reference-sticker ${stickerStyles[index % stickerStyles.length]}`}
            >
              <div className="reference-sticker__image">
                {page.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={page.thumbnailUrl} alt="" loading="lazy" />
                ) : (
                  <span aria-hidden="true">W</span>
                )}
              </div>
              <p className="reference-sticker__source">Wikipedia signpost</p>
              <h3 className="mt-2 font-display text-xl leading-tight text-ink">{page.title}</h3>
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-mist">{page.summary}</p>
              <span className="mt-5 inline-flex text-xs uppercase tracking-[0.16em] text-brass">
                Read the page ↗
              </span>
            </a>
          ))}

          {references.commons.map((sticker, index) => (
            <a
              key={sticker.pageUrl}
              href={sticker.pageUrl}
              target="_blank"
              rel="noreferrer"
              className={`reference-sticker reference-sticker--commons ${stickerStyles[(index + 1) % stickerStyles.length]}`}
            >
              <div className="reference-sticker__image reference-sticker__image--commons">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sticker.imageUrl} alt={sticker.title} loading="lazy" />
              </div>
              <p className="reference-sticker__source">Wikimedia Commons image</p>
              <h3 className="mt-2 font-display text-xl leading-tight text-ink">{sticker.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-aluminum-muted">
                {sticker.attribution} · {sticker.license}
              </p>
              <span className="mt-5 inline-flex text-xs uppercase tracking-[0.16em] text-brass">
                Open source file ↗
              </span>
            </a>
          ))}
        </div>
      )}

      {state === "ready" && (
        <p className="mt-6 text-xs leading-relaxed text-aluminum-muted">
          Images are shown as Wikimedia Commons thumbnails with source-page links and
          visible license credit. Wikipedia and Wikimedia Commons own their reference material.
        </p>
      )}
    </section>
  );
}
