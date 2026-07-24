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
    <section className="relative mx-auto flex min-h-[78vh] w-full max-w-3xl flex-col justify-center px-5 pb-16 pt-10">
      <p className="animate-fade-up mb-4 text-xs uppercase tracking-[0.22em] text-brass">
        Field guide to the built world
      </p>
      <h1 className="animate-fade-up font-display text-[2.6rem] leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl [animation-delay:80ms]">
        Lift the Lid
      </h1>
      <p className="animate-fade-up mt-5 max-w-md text-lg leading-relaxed text-mist [animation-delay:140ms]">
        The user manual nobody reads. Brought to life.
      </p>
      <div className="animate-fade-up mt-10 [animation-delay:220ms]">
        <ScanButton onFile={handleFile} />
      </div>
    </section>
  );
}
