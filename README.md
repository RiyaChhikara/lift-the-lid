# Lift the Lid

The user manual nobody reads. Brought to life.

Mobile-first Next.js 14 field guide: photograph an everyday object, get a teardown-style engineering story, optionally turn it into an industrial design sketch, and share it in a public gallery.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Gemini (`gemini-flash-latest`) for identify JSON
- Gemini image model for industrial design sketches
- Supabase (Postgres + Storage) for the public gallery

## Setup

```bash
npm install
cp .env.example .env.local
# fill GEMINI_API_KEY (and Supabase keys for gallery)
npm run dev
```

### Supabase

1. Create a project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Create a **public** Storage bucket named `scans`.
4. Put URL + anon key + service role key in `.env.local`.

Without Supabase, scanning and the local shelf still work; public save returns 503 until configured.

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
