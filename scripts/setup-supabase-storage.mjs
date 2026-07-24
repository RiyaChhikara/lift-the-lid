import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const env = {};
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

const env = loadEnvLocal();
const url = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\.supabase\.co=+$/i, ".supabase.co");
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
if (listErr) {
  console.error("Could not list buckets:", listErr.message);
  process.exit(1);
}

const existing = buckets?.find((b) => b.name === "scans" || b.id === "scans");
if (existing) {
  console.log('Storage bucket "scans" already exists.');
  process.exit(0);
}

const { data, error } = await supabase.storage.createBucket("scans", {
  public: true,
  fileSizeLimit: 5 * 1024 * 1024,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
});

if (error) {
  console.error("Failed to create bucket:", error.message);
  console.error(
    "\nManual fix: Supabase Dashboard → Storage → New bucket → name it exactly \"scans\" → Public bucket ON"
  );
  process.exit(1);
}

console.log('Created public storage bucket "scans".', data);
