/**
 * Client-side image compression for Vercel body limits (~4.5MB)
 * and cheaper/faster Gemini calls.
 */
export async function compressImageFile(
  file: File,
  options: { maxEdge?: number; quality?: number } = {}
): Promise<{ dataUrl: string; base64: string; mimeType: "image/jpeg" }> {
  const maxEdge = options.maxEdge ?? 1280;
  const quality = options.quality ?? 0.8;

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas not available");
  }
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  const base64 = dataUrl.split(",")[1] ?? "";
  return { dataUrl, base64, mimeType: "image/jpeg" };
}

export function stripDataUrl(dataUrl: string): { base64: string; mimeType: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return { base64: dataUrl, mimeType: "image/jpeg" };
  }
  return { mimeType: match[1], base64: match[2] };
}
