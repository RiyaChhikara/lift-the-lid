import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function cleanSupabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return raw
    .trim()
    .replace(/\.supabase\.co=+$/i, ".supabase.co")
    .replace(/\/+$/, "");
}

function cleanEnv(raw: string | undefined): string | undefined {
  return raw?.trim() || undefined;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = cleanSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) return null;

  // Fresh client per call — avoids stale singletons across Next.js RSC/route bundles.
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function publicStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const url = cleanSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!url) return null;
  return `${url}/storage/v1/object/public/scans/${path}`;
}

export const SCANS_BUCKET = "scans";
