import { getCuriosityThreads } from "@/lib/curiosity";
import type { Story } from "@/lib/types";

type Props = {
  story: Story;
};

export function CuriosityMap({ story }: Props) {
  const layers = story.layers.slice(0, 3);
  const materials = story.materials.slice(0, 2);
  const threads = getCuriosityThreads(story);

  return (
    <section className="mt-16 rounded-[2rem] border border-graphite-700 bg-graphite-900/75 p-5 shadow-glow sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Curiosity map</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-ink">
            Keep following the thread
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist">
            One object is a starting point. Follow its layers, materials, and history to
            see what else is hiding in plain sight.
          </p>
        </div>
        <span className="chip shrink-0 self-start sm:self-auto">{story.name} / field note</span>
      </div>

      <div className="relative mt-8">
        <svg
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          viewBox="0 0 1000 390"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="curiosity-line" d="M 250 195 C 330 195, 350 70, 440 70" />
          <path className="curiosity-line" d="M 250 195 C 340 195, 350 195, 440 195" />
          <path className="curiosity-line" d="M 250 195 C 330 195, 350 320, 440 320" />
          <path className="curiosity-line curiosity-line--soft" d="M 560 70 C 660 70, 670 112, 750 112" />
          <path className="curiosity-line curiosity-line--soft" d="M 560 195 C 660 195, 670 195, 750 195" />
          <path className="curiosity-line curiosity-line--soft" d="M 560 320 C 660 320, 670 278, 750 278" />
        </svg>

        <div className="relative grid gap-3 lg:grid-cols-[0.85fr_1.2fr_0.85fr] lg:items-center">
          <article className="node-card node-card--hero">
            <p className="node-kicker">01 / the object</p>
            <h3 className="mt-3 font-display text-2xl text-ink">{story.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-mist">{story.hook}</p>
            <div className="mt-5 flex items-center gap-2 text-xs text-brass">
              <span className="h-2 w-2 rounded-full bg-brass" />
              starting point
            </div>
          </article>

          <div className="grid gap-3">
            {layers.map((layer, index) => (
              <article className="node-card" key={`${layer.layer}-${index}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="node-kicker">Layer {String(index + 1).padStart(2, "0")}</p>
                  <span className="h-2 w-2 rounded-full bg-teal" />
                </div>
                <h3 className="mt-2 font-display text-lg text-ink">{layer.layer}</h3>
                <p className="mt-1 text-xs leading-relaxed text-aluminum-muted">{layer.role}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-3">
            {materials.length > 0 && (
              <article className="node-card node-card--warm">
                <p className="node-kicker">Made from</p>
                <h3 className="mt-2 font-display text-lg text-ink">{materials[0].material}</h3>
                <p className="mt-1 text-xs leading-relaxed text-mist">{materials[0].why}</p>
              </article>
            )}
            {story.history && (
              <article className="node-card node-card--cool">
                <p className="node-kicker">Before this</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{story.history}</p>
              </article>
            )}
            {materials.length > 1 && (
              <article className="node-card">
                <p className="node-kicker">Also in the mix</p>
                <p className="mt-2 font-display text-lg text-ink">{materials[1].material}</p>
              </article>
            )}
          </div>
        </div>
      </div>

      {threads.length > 0 && (
        <div className="mt-8 border-t border-graphite-700 pt-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="node-kicker">04 / rabbit holes</p>
              <h3 className="mt-2 font-display text-2xl text-ink">Questions worth chasing</h3>
            </div>
            <span className="hidden text-xs text-aluminum-muted sm:inline">tap, read, keep going</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {threads.map((thread, index) => (
              <article className="question-card" key={`${thread.question}-${index}`}>
                <p className="text-xs uppercase tracking-[0.16em] text-brass">{thread.label}</p>
                <h4 className="mt-2 font-display text-lg leading-snug text-ink">{thread.question}</h4>
                <p className="mt-2 text-sm leading-relaxed text-mist">{thread.answer}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
