"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import demosData from "@/data/demos.json";
import { StoryView } from "@/components/StoryView";
import { ScanButton } from "@/components/ScanButton";
import { compressImageFile } from "@/lib/compress-image";
import { addToShelf } from "@/lib/shelf";
import type { DemoEntry, Story } from "@/lib/types";

type PendingImage = {
  dataUrl: string;
  base64: string;
  mimeType: string;
};

export default function ScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demoId = searchParams.get("demo");

  const demos = demosData.demos as DemoEntry[];
  const demo = useMemo(
    () => demos.find((d) => d.id === demoId) ?? null,
    [demoId, demos]
  );

  const [pending, setPending] = useState<PendingImage | null>(null);
  const [story, setStory] = useState<Story | null>(demo?.story ?? null);
  const [photoUrl, setPhotoUrl] = useState(demo?.image ?? "");
  const [sketchUrl, setSketchUrl] = useState<string | null>(demo?.sketch ?? null);
  const [loading, setLoading] = useState(false);
  const [sketchLoading, setSketchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);

  useEffect(() => {
    if (demo) {
      setStory(demo.story);
      setPhotoUrl(demo.image);
      setSketchUrl(demo.sketch ?? null);
      addToShelf({
        id: `demo-${demo.id}`,
        name: demo.story.name,
        hook: demo.story.hook,
        imageDataUrl: demo.image,
        savedAt: new Date().toISOString(),
      });
      return;
    }

    const raw = sessionStorage.getItem("lift-the-lid:pending");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as PendingImage;
      setPending(parsed);
      setPhotoUrl(parsed.dataUrl);
      void runIdentify(parsed);
    } catch {
      setError("Could not read the uploaded image.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);

  async function runIdentify(image: PendingImage) {
    setLoading(true);
    setError(null);
    setSaveMessage(null);
    setPublicId(null);
    setSketchUrl(null);
    try {
      const res = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: image.base64,
          mimeType: image.mimeType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Identify failed");
      const nextStory = data.story as Story;
      setStory(nextStory);
      addToShelf({
        id: `local-${Date.now()}`,
        name: nextStory.name,
        hook: nextStory.hook,
        imageDataUrl: image.dataUrl,
        savedAt: new Date().toISOString(),
      });
      void runSketch(image, nextStory.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function runSketch(image: PendingImage, objectName: string) {
    setSketchLoading(true);
    try {
      const res = await fetch("/api/sketch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: image.base64,
          mimeType: image.mimeType,
          objectName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.imageDataUrl) {
        setSketchUrl(data.imageDataUrl as string);
      }
    } catch {
      // Sketch is optional; story still works.
    } finally {
      setSketchLoading(false);
    }
  }

  async function handleNewFile(file: File) {
    const compressed = await compressImageFile(file);
    const next = {
      dataUrl: compressed.dataUrl,
      base64: compressed.base64,
      mimeType: compressed.mimeType,
    };
    sessionStorage.setItem("lift-the-lid:pending", JSON.stringify(next));
    setPending(next);
    setPhotoUrl(next.dataUrl);
    setStory(null);
    setSketchUrl(null);
    router.replace("/scan");
    void runIdentify(next);
  }

  async function savePublic() {
    if (!story || !pending) return;
    if (story.confidence === "low") {
      setSaveMessage("Low-confidence scans stay on your shelf — not the public gallery.");
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story,
          imageBase64: pending.base64,
          mimeType: pending.mimeType,
          sketchDataUrl: sketchUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save");
      setPublicId(data.id as string);
      addToShelf({
        id: `public-${data.id}`,
        name: story.name,
        hook: story.hook,
        imageDataUrl: pending.dataUrl,
        publicId: data.id as string,
        savedAt: new Date().toISOString(),
      });
      setSaveMessage("Saved to the public gallery.");
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!demo && !pending && !loading && !story) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-3xl text-ink">Scan an object</h1>
        <p className="mt-3 text-mist">Use your camera or photo library.</p>
        <div className="mt-8">
          <ScanButton onFile={handleNewFile} />
        </div>
      </div>
    );
  }

  if (loading || (!story && pending)) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-5 text-center">
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt="Uploaded object"
            className="mb-8 aspect-square w-48 rounded-sm object-cover opacity-80"
          />
        )}
        <p className="animate-pulse-soft font-display text-2xl text-ink">
          Opening it up…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-5 text-center">
        <p className="text-mist">{error}</p>
        <div className="mt-8">
          <ScanButton onFile={handleNewFile} label="Try another photo" />
        </div>
      </div>
    );
  }

  if (!story) return null;

  return (
    <StoryView
      story={story}
      photoUrl={photoUrl}
      sketchUrl={sketchUrl}
      sketchLoading={sketchLoading}
      actions={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ScanButton onFile={handleNewFile} label="Scan another" className="!px-5 !py-2.5" />
          {pending && (
            <button
              type="button"
              disabled={saving || story.confidence === "low"}
              onClick={() => void savePublic()}
              className="rounded-full border border-graphite-600 px-5 py-2.5 text-sm text-aluminum transition hover:border-brass hover:text-brass disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save to public gallery"}
            </button>
          )}
          {publicId && (
            <a href={`/s/${publicId}`} className="text-sm text-brass hover:text-brass-soft">
              Open share page →
            </a>
          )}
          {saveMessage && <p className="text-sm text-mist">{saveMessage}</p>}
        </div>
      }
    />
  );
}
