import type { Story } from "./types";

/** Strip markdown fences and parse model JSON defensively. */
export function parseStoryJson(raw: string): Story {
  let text = raw.trim();

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    text = fenced[1].trim();
  } else {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      text = text.slice(first, last + 1);
    }
  }

  const parsed = JSON.parse(text) as Partial<Story>;
  return normalizeStory(parsed);
}

export function normalizeStory(parsed: Partial<Story>): Story {
  const confidence = parsed.confidence;
  const safeConfidence =
    confidence === "high" || confidence === "medium" || confidence === "low"
      ? confidence
      : "low";

  const layers = Array.isArray(parsed.layers)
    ? parsed.layers
        .filter((l) => l && typeof l === "object")
        .map((l) => ({
          layer: String(l.layer ?? ""),
          role: String(l.role ?? ""),
          marvel: String(l.marvel ?? ""),
        }))
        .filter((l) => l.layer || l.role || l.marvel)
        .slice(0, 7)
    : [];

  const materials = Array.isArray(parsed.materials)
    ? parsed.materials
        .filter((m) => m && typeof m === "object")
        .map((m) => ({
          material: String(m.material ?? ""),
          why: String(m.why ?? ""),
        }))
        .filter((m) => m.material)
    : [];

  return {
    name: String(parsed.name ?? "Unknown object").trim() || "Unknown object",
    hook: String(parsed.hook ?? "").trim(),
    confidence: safeConfidence,
    layers,
    materials,
    the_marvel: String(parsed.the_marvel ?? "").trim(),
    history: String(parsed.history ?? "").trim(),
    look_closer: String(parsed.look_closer ?? "").trim(),
  };
}

export function isValidStoryShape(story: unknown): story is Story {
  if (!story || typeof story !== "object") return false;
  const s = story as Partial<Story>;
  if (typeof s.name !== "string" || !s.name.trim()) return false;
  if (typeof s.hook !== "string") return false;
  if (s.confidence !== "high" && s.confidence !== "medium" && s.confidence !== "low") {
    return false;
  }
  if (!Array.isArray(s.layers) || s.layers.length < 1) return false;
  if (!Array.isArray(s.materials)) return false;
  if (typeof s.the_marvel !== "string") return false;
  if (typeof s.history !== "string") return false;
  if (typeof s.look_closer !== "string") return false;
  return true;
}
