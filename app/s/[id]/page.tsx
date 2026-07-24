import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StoryView } from "@/components/StoryView";
import { getSupabaseAdmin, publicStorageUrl } from "@/lib/supabase/server";
import type { Story } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

async function loadScan(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("scans")
    .select("id, created_at, name, story, image_path, sketch_path, hidden")
    .eq("id", id)
    .eq("hidden", false)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const scan = await loadScan(params.id);
  if (!scan) {
    return { title: "Scan not found" };
  }

  const story = scan.story as Story;
  const imageUrl = publicStorageUrl(scan.image_path) || "/og-default.jpg";

  return {
    title: story.name,
    description: story.hook,
    openGraph: {
      title: `${story.name} · Lift the Lid`,
      description: story.hook,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: story.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${story.name} · Lift the Lid`,
      description: story.hook,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const scan = await loadScan(params.id);
  if (!scan) notFound();

  const story = scan.story as Story;
  const photoUrl = publicStorageUrl(scan.image_path) || "/og-default.jpg";
  const sketchUrl = publicStorageUrl(scan.sketch_path);

  return (
    <StoryView
      story={story}
      photoUrl={photoUrl}
      sketchUrl={sketchUrl}
    />
  );
}
