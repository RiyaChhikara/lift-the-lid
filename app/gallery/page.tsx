import { PublicGallery } from "@/components/PublicGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public gallery",
  description: "Shared teardowns from Lift the Lid — ordinary objects, opened up.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10">
      <h1 className="font-display text-4xl text-ink">Public gallery</h1>
      <p className="mt-3 max-w-md text-mist">
        Teardowns people chose to share. Quiet objects, opened carefully.
      </p>
      <PublicGallery />
    </div>
  );
}
