import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { sketchPrompt } from "@/lib/sketch-prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const imageBase64 = body.imageBase64 as string | undefined;
    const mimeType = (body.mimeType as string | undefined) || "image/jpeg";
    const objectName = body.objectName as string | undefined;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 });
    }

    if (imageBase64.length > 3_500_000) {
      return NextResponse.json(
        { error: "Image too large. Compress before upload." },
        { status: 413 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Image-capable Gemini model for sketch generation
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-preview-image-generation",
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      } as Record<string, unknown>,
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      { text: sketchPrompt(objectName) },
    ]);

    const parts = result.response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if ("inlineData" in part && part.inlineData?.data) {
        const outMime = part.inlineData.mimeType || "image/png";
        const imageDataUrl = `data:${outMime};base64,${part.inlineData.data}`;
        return NextResponse.json({ imageDataUrl });
      }
    }

    return NextResponse.json(
      { error: "No sketch image returned from model" },
      { status: 502 }
    );
  } catch (err) {
    console.error("sketch error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sketch failed" },
      { status: 500 }
    );
  }
}
