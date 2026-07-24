import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isValidStoryShape } from "@/lib/gemini";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  getSupabaseAdmin,
  publicStorageUrl,
  SCANS_BUCKET,
} from "@/lib/supabase/server";
import type { Story } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_B64 = 3_500_000;

function parseSketchDataUrl(dataUrl?: string | null): {
  base64: string;
  mimeType: string;
} | null {
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], base64: match[2] };
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ scans: [], configured: false });
  }

  const { data, error } = await supabase
    .from("scans")
    .select("id, created_at, name, story, image_path, sketch_path, hidden")
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(48);

  if (error) {
    console.error("scans list error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const scans = (data ?? []).map((row) => ({
    ...row,
    image_url: publicStorageUrl(row.image_path),
    sketch_url: publicStorageUrl(row.sketch_path),
  }));

  return NextResponse.json({ scans, configured: true });
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`scans:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many saves. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Public gallery is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const story = body.story as Story | undefined;
    const imageBase64 = body.imageBase64 as string | undefined;
    const mimeType = (body.mimeType as string | undefined) || "image/jpeg";
    const sketchDataUrl = body.sketchDataUrl as string | undefined;

    if (!isValidStoryShape(story)) {
      return NextResponse.json({ error: "Invalid story shape" }, { status: 400 });
    }

    if (story.confidence === "low") {
      return NextResponse.json(
        { error: "Low-confidence scans cannot be saved to the public gallery." },
        { status: 400 }
      );
    }

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 });
    }

    if (imageBase64.length > MAX_IMAGE_B64) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const id = randomUUID();
    const imageExt = mimeType.includes("png") ? "png" : "jpg";
    const imagePath = `${id}/photo.${imageExt}`;

    const imageBuffer = Buffer.from(imageBase64, "base64");
    const { error: imageErr } = await supabase.storage
      .from(SCANS_BUCKET)
      .upload(imagePath, imageBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (imageErr) {
      console.error("image upload error", imageErr);
      return NextResponse.json({ error: imageErr.message }, { status: 500 });
    }

    let sketchPath: string | null = null;
    const sketch = parseSketchDataUrl(sketchDataUrl);
    if (sketch && sketch.base64.length <= MAX_IMAGE_B64) {
      const sketchExt = sketch.mimeType.includes("png") ? "png" : "jpg";
      sketchPath = `${id}/sketch.${sketchExt}`;
      const sketchBuffer = Buffer.from(sketch.base64, "base64");
      const { error: sketchErr } = await supabase.storage
        .from(SCANS_BUCKET)
        .upload(sketchPath, sketchBuffer, {
          contentType: sketch.mimeType,
          upsert: false,
        });
      if (sketchErr) {
        console.error("sketch upload error", sketchErr);
        sketchPath = null;
      }
    }

    const { data, error } = await supabase
      .from("scans")
      .insert({
        id,
        name: story.name,
        story,
        image_path: imagePath,
        sketch_path: sketchPath,
        hidden: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("scan insert error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      url: `/s/${data.id}`,
    });
  } catch (err) {
    console.error("scans POST error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed" },
      { status: 500 }
    );
  }
}
