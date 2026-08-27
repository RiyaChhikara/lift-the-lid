import { getSupabaseAdmin, publicStorageUrl } from "@/lib/supabase/server";
import type { PublicScan } from "@/lib/types";

export async function listPublicScans(limit = 48): Promise<{
  scans: PublicScan[];
  configured: boolean;
  error?: string;
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { scans: [], configured: false };
  }

  const { data, error } = await supabase
    .from("scans")
    .select("id, created_at, name, story, image_path, sketch_path, hidden")
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("listPublicScans error", error);
    const message = error.message.toLowerCase();
    const friendlyError =
      message.includes("fetch failed") || message.includes("enotfound")
        ? "The public gallery is having trouble reconnecting. Scans still work on your shelf."
        : "The public gallery is unavailable right now. Scans still work on your shelf.";
    return { scans: [], configured: true, error: friendlyError };
  }

  const scans = (data ?? []).map((row) => ({
    ...row,
    story: row.story as PublicScan["story"],
    image_url: publicStorageUrl(row.image_path) ?? undefined,
    sketch_url: publicStorageUrl(row.sketch_path),
  }));

  return { scans, configured: true };
}
