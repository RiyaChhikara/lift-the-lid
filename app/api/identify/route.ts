import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { IDENTIFY_SYSTEM_PROMPT } from "@/lib/prompt";
import { parseStoryJson } from "@/lib/gemini";

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

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 });
    }

    // Guard oversized payloads (~3MB base64 ≈ under Vercel limit with headroom)
    if (imageBase64.length > 3_500_000) {
      return NextResponse.json(
        { error: "Image too large. Compress before upload." },
        { status: 413 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: IDENTIFY_SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      {
        text: "Identify this object and return the Lift the Lid JSON story.",
      },
    ]);

    const text = result.response.text();
    const story = parseStoryJson(text);
    return NextResponse.json({ story });
  } catch (err) {
    console.error("identify error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Identify failed" },
      { status: 500 }
    );
  }
}
