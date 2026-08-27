"use client";

import { useRouter } from "next/navigation";
import { ScanButton } from "./ScanButton";
import { compressImageFile } from "@/lib/compress-image";

export function Hero() {
  const router = useRouter();

  async function handleFile(file: File) {
    const compressed = await compressImageFile(file);
    sessionStorage.setItem(
      "lift-the-lid:pending",
      JSON.stringify({
        dataUrl: compressed.dataUrl,
        base64: compressed.base64,
        mimeType: compressed.mimeType,
      })
    );
    router.push("/scan");
  }

  return (
    <section className="relative mx-auto grid min-h-[78vh] w-full max-w-5xl items-center gap-12 overflow-hidden px-5 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative z-10">
        <p className="animate-fade-up mb-4 text-xs uppercase tracking-[0.22em] text-brass">
          Field guide to the built world
        </p>
        <h1 className="animate-fade-up max-w-xl font-display text-[2.8rem] leading-[1.02] tracking-tight text-ink sm:text-5xl md:text-6xl [animation-delay:80ms]">
          Open the objects you already live with.
        </h1>
        <p className="animate-fade-up mt-5 max-w-md text-lg leading-relaxed text-mist [animation-delay:140ms]">
          The user manual nobody reads, turned into a trail of parts, materials, and
          questions.
        </p>
        <div className="animate-fade-up mt-10 [animation-delay:220ms]">
          <ScanButton onFile={handleFile} />
        </div>
        <p className="mt-4 text-xs text-aluminum-muted">No account. No API key on your device.</p>
      </div>

      <div className="hero-map animate-reveal" aria-label="A preview of the Lift the Lid curiosity map">
        <div className="hero-orbit hero-orbit--one" />
        <div className="hero-orbit hero-orbit--two" />
        <div className="hero-map__header">
          <span>field note / 001</span>
          <span>look closer</span>
        </div>
        <div className="hero-map__core">
          <span className="hero-map__dot" />
          <p className="text-xs uppercase tracking-[0.18em] text-brass">ordinary object</p>
          <p className="mt-2 font-display text-2xl text-ink">What is hiding here?</p>
        </div>
        <div className="hero-map__node hero-map__node--top">
          <span>inside</span>
          <strong>layers</strong>
        </div>
        <div className="hero-map__node hero-map__node--right">
          <span>made from</span>
          <strong>materials</strong>
        </div>
        <div className="hero-map__node hero-map__node--bottom">
          <span>before this</span>
          <strong>history</strong>
        </div>
        <div className="hero-map__caption">
          <span>scan → story → rabbit hole</span>
          <span className="hero-map__spark">✦</span>
        </div>
      </div>
    </section>
  );
}
