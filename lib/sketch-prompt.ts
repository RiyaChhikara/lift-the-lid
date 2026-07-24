export function sketchPrompt(objectName?: string): string {
  const subject = objectName?.trim()
    ? `the object in the photo (identified as: ${objectName.trim()})`
    : "the object in the photo";

  return `Create a neat, chic industrial design sketch of ${subject}.

Style: Super Normal / Industrial Design A–Z field-guide drawing. Clean technical product design sketch on a soft graphite or off-white paper ground. Precise line weights, subtle construction lines, light hatching for form — not a cartoon, not a photoreal render, not neon CGI.

Prefer a calm orthographic or gently exploded product view. Celebrate ordinary hardware with quiet precision (Braun / Apple material honesty). No logos invented, no marketing text, no stickers, no purple glow, no cluttered UI chrome.

Output a single refined industrial design sketch image.`;
}
