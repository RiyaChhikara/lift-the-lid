# Lift the Lid

The user manual nobody reads. Brought to life.

Mobile-first Next.js 14 field guide: photograph an everyday object, get a teardown-style engineering story, follow a visual curiosity map, optionally turn it into an industrial design sketch, and share it in a public gallery.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Gemini (`gemini-flash-latest`) for identify JSON
- Gemini (`gemini-2.5-flash-image`) for industrial design sketches
- Supabase (Postgres + Storage) for the public gallery

## What happens after a scan

Every story now includes a curiosity map. It connects the object to its visible layers,
materials, history, and a short set of follow-up questions. Older stories and the demo
objects still render safely: when the model does not return curiosity threads, the app
derives them from the existing story fields.

## Setup

```bash
npm install
cp .env.example .env.local
# fill GEMINI_API_KEY (and Supabase keys for gallery)
npm run dev
```

### Supabase

1. Create a project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor (table + storage bucket + policies).
3. Or, if the table already exists, create storage only:
   ```bash
   npm run setup:supabase-storage
   ```
4. Put URL + anon key + service role key in `.env.local`.

Without Supabase, scanning and the local shelf still work. The public gallery shows a
clear paused state, and public save returns 503 until the storage connection is restored.

## Deploy to Vercel

Yes — this is ready for a simple Vercel deploy.

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add environment variables (same as `.env.local`):
   - `GEMINI_API_KEY`
   - `GEMINI_SKETCH_MODEL` (optional)
   - `NEXT_PUBLIC_SITE_URL` → your production URL, e.g. `https://your-app.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. Run `supabase/schema.sql` and `npm run setup:supabase-storage` against your production Supabase project if not done already.

Waitlist emails are stored in Supabase (`waitlist` table) when configured; otherwise they only appear in server logs during local dev.

## Routes

| Path | Purpose |
|---|---|
| `/` | Hero, demos, shelf, gallery teaser, waitlist |
| `/scan` | Upload / camera → identify → story + sketch |
| `/gallery` | Public scans (`hidden = false`) |
| `/s/[id]` | Share page with Open Graph metadata |
| `/api/identify` | Gemini story JSON |
| `/api/sketch` | Industrial design sketch image |
| `/api/scans` | Guarded public create + list |
| `/api/waitlist` | Logs email for now |

## Client compression

Before any image POST, photos are resized (max edge 1280px) and JPEG-compressed (~0.8) in the browser — stays under Vercel body limits and speeds Gemini.

## Gallery write guards

- IP rate limit (5 POSTs / 10 minutes)
- Rejects `confidence: "low"`
- Validates story shape
- `hidden` column for soft moderation

## Demo art

Placeholders in `public/demos/` use a clean industrial-sketch look. To regenerate with Higgsfield (when authenticated):

```bash
higgsfield auth login
higgsfield product-photoshoot create \
  --mode conceptual_product \
  --prompt "industrial design sketch of a smartphone, Super Normal, graphite paper, neat line work" \
  --count 1
```

## Project rules (not a Skill)

Voice/schema/art live in [`.cursor/rules/lift-the-lid.mdc`](.cursor/rules/lift-the-lid.mdc). Do not create a Cursor Skill for this app.

## Prompt sandbox to refine the output: 
https://partyrock.aws/u/ninelabs/whqgxIN6J/lift-the-lid
