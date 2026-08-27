# Lift the Lid improvements

Date: 27 August 2026

## What changed

- Reworked the landing page from near-black graphite into a warmer paper-and-ink field guide with a quiet brass and teal accent system.
- Added a visual curiosity map after every scan. It links the object to its first layers, materials, history, and a set of follow-up questions.
- Extended the Gemini story shape with optional curiosity threads, while keeping a derived fallback for existing demo data and older scans.
- Restyled the teardown, sketch, demo, shelf, and gallery cards so the page feels more like a collection of annotated field notes than a plain results list.
- Replaced the public gallery's raw `TypeError: fetch failed` state with a clear paused state and a retry action.
- Marked `/api/scans` as dynamic so the gallery does not accidentally serve a stale response after a deployment.
- Added a Wikimedia reference trail after the curiosity map. Wikipedia results link to the relevant page, while Commons results render as cutesy stickers with source-page, attribution, and license details.

## Key decisions

- The curiosity map is dependency-free and uses the existing story fields, so the app stays lightweight and the UI works even when the model returns an older schema.
- The model can now return three to four grounded threads, but the UI never requires them to render a scan.
- Low-confidence scans remain local-only. Public sharing keeps the existing moderation guard.
- Reference cards are signposts only. The app does not copy long encyclopedia text or host the source images.

## Known limitation

The current local environment points at a Supabase hostname that does not resolve, so `/api/scans` returns a friendly 503 and the gallery stays paused. Scanning, the local shelf, demos, share-page UI, and Wikimedia reference trail still build correctly. Restoring the Supabase URL and storage credentials will bring public reads and saves back without another code change.

## Instagram-ready summary

I gave Lift the Lid a proper second layer.

It still scans the everyday objects around me, but now the result keeps unfolding: a warmer field-guide design, a map of the parts and materials inside the object, a little history, and questions that send you down the next rabbit hole.

The idea is simple: curiosity should not stop at “what is this?” It should lead to “what is hiding underneath, what did it replace, and what can I spot with my own eyes?”

Built with Next.js, Gemini, Supabase, and a slightly obsessive habit of looking closer.

## Hashtags

#LiftTheLid #CuriousAboutHardware #IndustrialDesign #EverydayObjects #CreativeCoding #Nextjs #Gemini #BuildInPublic #HardwareDesign #NineLabs

Tags: @huggingface @pollenrobotics
