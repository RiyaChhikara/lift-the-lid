import { PublicGallery } from "@/components/PublicGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public gallery",
  description: "Shared teardowns from Lift the Lid — ordinary objects, opened up.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">A shared shelf</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Public gallery
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-mist">
          Teardowns people chose to share. Quiet objects, opened carefully, with a few
          rabbit holes left visible.
        </p>
      </div>
      <PublicGallery />
    </div>
  );
}
