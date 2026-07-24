import type { Story } from "@/lib/types";

export function LayerStack({ story }: { story: Story }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl text-ink">Inside, top to bottom</h2>
      <p className="mt-2 text-sm text-mist">Outside-in, like a teardown.</p>
      <ol className="mt-8 space-y-0">
        {story.layers.map((layer, index) => (
          <li
            key={`${layer.layer}-${index}`}
            className="animate-reveal relative border-l border-graphite-700 pl-6 pb-10 last:pb-0"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-brass" />
            <p className="text-xs uppercase tracking-[0.18em] text-brass">
              Layer {index + 1}
            </p>
            <h3 className="mt-2 font-display text-xl text-ink">{layer.layer}</h3>
            <p className="mt-1 text-sm text-aluminum-muted">{layer.role}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-mist">{layer.marvel}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
