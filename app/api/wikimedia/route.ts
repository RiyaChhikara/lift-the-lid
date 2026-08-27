import { NextResponse } from "next/server";
import type { WikimediaReferences, WikimediaSticker, WikipediaReference } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WIKIPEDIA_API = "https://en.wikipedia.org/w/rest.php/v1/search/page";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = `LiftTheLid/0.1 (${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"})`;

type WikipediaSearchResponse = {
  pages?: Array<{
    key?: string;
    title?: string;
    excerpt?: string;
    description?: string;
    thumbnail?: { url?: string };
  }>;
};

type CommonsSearchResponse = {
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        imageinfo?: Array<{
          thumburl?: string;
          descriptionurl?: string;
          extmetadata?: Record<string, { value?: string }>;
        }>;
      }
    >;
  };
};

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteImageUrl(url?: string) {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

function wikipediaUrl(key: string) {
  return `https://en.wikipedia.org/wiki/${key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`Wikimedia request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

async function searchWikipedia(query: string): Promise<WikipediaReference[]> {
  const url = new URL(WIKIPEDIA_API);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "4");
  const data = await getJson<WikipediaSearchResponse>(url.toString());

  return (data.pages ?? [])
    .filter((page) => page.title && page.key)
    .map((page) => ({
      title: page.title as string,
      summary: stripHtml(page.description || page.excerpt || "A related Wikipedia page."),
      url: wikipediaUrl(page.key as string),
      thumbnailUrl: absoluteImageUrl(page.thumbnail?.url),
    }));
}

async function searchCommons(query: string): Promise<WikimediaSticker[]> {
  const url = new URL(COMMONS_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "6");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|extmetadata");
  url.searchParams.set("iiurlwidth", "420");
  url.searchParams.set("format", "json");

  const data = await getJson<CommonsSearchResponse>(url.toString());
  return Object.values(data.query?.pages ?? {})
    .map((page) => {
      const image = page.imageinfo?.[0];
      const metadata = image?.extmetadata ?? {};
      const imageUrl = absoluteImageUrl(image?.thumburl);
      if (!page.title || !imageUrl) return null;

      return {
        title: page.title.replace(/^File:/i, ""),
        imageUrl,
        pageUrl:
          image?.descriptionurl ||
          `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`,
        license: stripHtml(metadata.LicenseShortName?.value || "See source page"),
        attribution: stripHtml(metadata.Artist?.value || metadata.Credit?.value || "Wikimedia Commons"),
      } satisfies WikimediaSticker;
    })
    .filter((sticker): sticker is WikimediaSticker => Boolean(sticker));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("object") || "").replace(/\s+/g, " ").trim().slice(0, 120);

  if (!query) {
    return NextResponse.json({ error: "An object name is required." }, { status: 400 });
  }

  const [wikipediaResult, commonsResult] = await Promise.allSettled([
    searchWikipedia(query),
    searchCommons(query),
  ]);

  if (wikipediaResult.status === "rejected") {
    console.error("Wikipedia search error", wikipediaResult.reason);
  }
  if (commonsResult.status === "rejected") {
    console.error("Wikimedia Commons search error", commonsResult.reason);
  }

  const wikipedia = wikipediaResult.status === "fulfilled" ? wikipediaResult.value : [];
  const commons = commonsResult.status === "fulfilled" ? commonsResult.value : [];
  const response: WikimediaReferences = {
    query,
    wikipedia,
    commons,
    ...(wikipedia.length === 0 && commons.length === 0
      ? { error: "No reference trail found yet. Try following the object's own details first." }
      : {}),
  };

  return NextResponse.json(response);
}
