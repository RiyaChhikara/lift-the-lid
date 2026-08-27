import type { Story } from "@/lib/types";

export function LayerStack({ story }: { story: Story }) {
  return (
    <section className="mt-16 max-w-2xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">The teardown</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Inside, top to bottom</h2>
        </div>
        <span className="hidden text-xs text-aluminum-muted sm:inline">outside → in</span>
      </div>
      <p className="mt-3 text-sm text-mist">Follow the stack. Each layer is doing a different job.</p>
      <ol className="mt-8 space-y-3">
        {story.layers.map((layer, index) => (
          <li
            key={`${layer.layer}-${index}`}
            className="animate-reveal relative rounded-2xl border border-graphite-700 bg-graphite-900/48 px-5 py-5 pl-16"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="absolute left-5 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-brass/50 text-xs text-brass">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-display text-xl text-ink">{layer.layer}</h3>
            <p className="mt-1 text-sm text-aluminum-muted">{layer.role}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-mist">{layer.marvel}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
