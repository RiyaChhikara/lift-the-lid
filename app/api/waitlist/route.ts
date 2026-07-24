import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from("waitlist").insert({ email });
      if (error) {
        if (error.code === "23505") {
          return NextResponse.json({ ok: true, stored: true });
        }
        console.error("[waitlist] supabase error", error);
        return NextResponse.json({ error: "Could not save email" }, { status: 500 });
      }
      return NextResponse.json({ ok: true, stored: true });
    }

    console.log("[waitlist]", email);
    return NextResponse.json({ ok: true, stored: false });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
