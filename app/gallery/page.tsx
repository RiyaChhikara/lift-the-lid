import { GalleryGrid } from "@/components/GalleryGrid";
import { getSupabaseAdmin, publicStorageUrl } from "@/lib/supabase/server";
import type { PublicScan } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public gallery",
  description: "Shared teardowns from Lift the Lid — ordinary objects, opened up.",
};

export const dynamic = "force-dynamic";

async function loadScans(): Promise<PublicScan[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("scans")
    .select("id, created_at, name, story, image_path, sketch_path, hidden")
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(48);

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data.map((row) => ({
    ...row,
    story: row.story as PublicScan["story"],
    image_url: publicStorageUrl(row.image_path) ?? undefined,
    sketch_url: publicStorageUrl(row.sketch_path),
  }));
}

export default async function GalleryPage() {
  const scans = await loadScans();
  const configured = Boolean(getSupabaseAdmin());

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10">
      <h1 className="font-display text-4xl text-ink">Public gallery</h1>
      <p className="mt-3 max-w-md text-mist">
        Teardowns people chose to share. Quiet objects, opened carefully.
      </p>
      {!configured && (
        <p className="mt-6 text-sm text-brass">
          Gallery storage is not configured yet. Scans still work on your shelf.
        </p>
      )}
      <GalleryGrid scans={scans} />
    </div>
  );
}
