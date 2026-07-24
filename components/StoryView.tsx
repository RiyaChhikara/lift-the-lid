import type { Story } from "@/lib/types";
import { LayerStack } from "./LayerStack";
import { SketchCompare } from "./SketchCompare";

type Props = {
  story: Story;
  photoUrl: string;
  sketchUrl?: string | null;
  sketchLoading?: boolean;
  actions?: React.ReactNode;
};

export function StoryView({
  story,
  photoUrl,
  sketchUrl,
  sketchLoading,
  actions,
}: Props) {
  return (
    <article className="mx-auto w-full max-w-2xl px-5 pb-20 pt-6">
      <header className="animate-fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">
          {story.confidence} confidence
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {story.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-mist">{story.hook}</p>
        {actions && <div className="mt-6">{actions}</div>}
      </header>

      <SketchCompare
        photoUrl={photoUrl}
        sketchUrl={sketchUrl}
        name={story.name}
        loading={sketchLoading}
      />

      <LayerStack story={story} />

      {story.materials.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">Made of</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {story.materials.map((m) => (
              <span key={m.material} className="chip" title={m.why}>
                {m.material}
              </span>
            ))}
          </div>
          <ul className="mt-5 space-y-3">
            {story.materials.map((m) => (
              <li key={`${m.material}-why`} className="text-sm leading-relaxed text-mist">
                <span className="text-aluminum">{m.material}.</span> {m.why}
              </li>
            ))}
          </ul>
        </section>
      )}

      {story.the_marvel && (
        <section className="mt-12 rounded-sm border border-brass/30 bg-graphite-900/80 px-5 py-6 shadow-glow">
          <h2 className="font-display text-2xl text-brass">The marvel</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink">{story.the_marvel}</p>
        </section>
      )}

      {story.history && (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">It wasn&apos;t always like this</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-mist">{story.history}</p>
        </section>
      )}

      {story.look_closer && (
        <section className="mt-12 border-t border-graphite-800 pt-10">
          <h2 className="font-display text-2xl text-ink">Look closer</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-aluminum">{story.look_closer}</p>
        </section>
      )}
    </article>
  );
}
