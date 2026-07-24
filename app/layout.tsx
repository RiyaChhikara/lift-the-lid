import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lift the Lid",
    template: "%s · Lift the Lid",
  },
  description:
    "The user manual nobody reads. Brought to life. Scan everyday objects and open them up.",
  openGraph: {
    title: "Lift the Lid",
    description: "The user manual nobody reads. Brought to life.",
    siteName: "Lift the Lid",
    type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Lift the Lid" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lift the Lid",
    description: "The user manual nobody reads. Brought to life.",
    images: ["/og-default.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} font-sans antialiased`}>
        <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-0 circuit-grid opacity-40" aria-hidden />
          <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-5 pb-2 pt-6">
            <Link href="/" className="font-display text-lg tracking-tight text-ink">
              Lift the Lid
            </Link>
            <nav className="flex items-center gap-5 text-sm text-mist">
              <Link href="/scan" className="transition hover:text-aluminum">
                Scan
              </Link>
              <Link href="/gallery" className="transition hover:text-aluminum">
                Gallery
              </Link>
            </nav>
          </header>
          <main className="relative z-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
