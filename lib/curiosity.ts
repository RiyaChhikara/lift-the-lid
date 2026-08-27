import type { CuriosityThread, Story } from "./types";

export function getCuriosityThreads(story: Story): CuriosityThread[] {
  if (story.curiosity && story.curiosity.length > 0) {
    return story.curiosity;
  }

  const firstLayer = story.layers[0];
  const firstMaterial = story.materials[0];
  const fallbackThreads: CuriosityThread[] = [];

  if (firstLayer) {
    fallbackThreads.push({
      label: "Inside",
      question: "What is hiding under the surface?",
      answer: firstLayer.marvel || firstLayer.role,
    });
  }

  if (firstMaterial) {
    fallbackThreads.push({
      label: "Material",
      question: `Why use ${firstMaterial.material.toLowerCase()} here?`,
      answer: firstMaterial.why,
    });
  }

  if (story.history) {
    fallbackThreads.push({
      label: "History",
      question: "What did this object replace?",
      answer: story.history,
    });
  }

  if (story.look_closer) {
    fallbackThreads.push({
      label: "Notice",
      question: "What can I find on it right now?",
      answer: story.look_closer,
    });
  }

  return fallbackThreads.filter((thread) => thread.answer).slice(0, 4);
}
