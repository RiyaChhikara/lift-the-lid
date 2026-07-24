"use client";

import { useState } from "react";

export function WaitlistFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="mx-auto w-full max-w-3xl border-t border-graphite-800 px-5 py-14">
      <h2 className="font-display text-xl text-ink">Workshops coming soon.</h2>
      <p className="mt-2 text-sm text-mist">
        Leave an email if you want the first look at in-person sessions.
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full flex-1 rounded-sm border border-graphite-700 bg-graphite-900 px-4 py-3 text-sm text-ink placeholder:text-graphite-600 outline-none focus:border-brass"
        />
        <button
          type="submit"
          className="rounded-sm border border-graphite-600 px-5 py-3 text-sm text-aluminum transition hover:border-brass hover:text-brass"
        >
          Notify me
        </button>
      </form>
      {status === "ok" && (
        <p className="mt-3 text-sm text-brass">You&apos;re on the list.</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-red-300">Something went wrong. Try again.</p>
      )}
    </footer>
  );
}
