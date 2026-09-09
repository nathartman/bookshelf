import { parseStringPromise } from "xml2js";
import type { GoodreadsBook } from "./types";

const GOODREADS_IMAGE_HOSTS = new Set([
  "i.gr-assets.com",
  "images.gr-assets.com",
]);

type GoodreadsItem = Record<string, unknown>;

export interface GetGoodreadsBooksOptions {
  rssUrl: string;
  shelves?: readonly string[];
  fetcher?: (url: URL) => Promise<Response>;
}

function firstString(value: unknown): string | null {
  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0].trim() || null;
  }

  return null;
}

function positiveInteger(value: unknown): number | null {
  const parsed = Number.parseInt(firstString(value) ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function safeCoverUrl(item: GoodreadsItem): string | null {
  const candidates = [
    firstString(item.book_large_image_url),
    firstString(item.book_medium_image_url),
    firstString(item.book_image_url),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    try {
      const url = new URL(candidate);
      if (
        url.protocol === "https:" &&
        GOODREADS_IMAGE_HOSTS.has(url.hostname)
      ) {
        return url.toString();
      }
    } catch {
      // Try the next cover supplied by Goodreads.
    }
  }

  return null;
}

function pageCountFrom(item: GoodreadsItem): number | null {
  if (!Array.isArray(item.book)) return null;

  const book = item.book[0];
  if (!book || typeof book !== "object") return null;

  return positiveInteger((book as GoodreadsItem).num_pages);
}

function parseBook(item: GoodreadsItem, index: number): GoodreadsBook | null {
  const title = firstString(item.title);
  const author = firstString(item.author_name);

  if (!title || !author) return null;

  return {
    id:
      firstString(item.book_id) ??
      firstString(item.guid) ??
      `${title}-${author}-${index}`,
    title,
    author,
    coverUrl: safeCoverUrl(item),
    pageCount: pageCountFrom(item),
    publishYear: positiveInteger(item.book_published),
    readDate: firstString(item.user_read_at),
  };
}

function readTime(book: GoodreadsBook): number {
  if (!book.readDate) return 0;

  const time = new Date(book.readDate).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export async function parseGoodreadsRss(
  xmlText: string,
): Promise<GoodreadsBook[]> {
  const result = await parseStringPromise(xmlText);
  const channel = result?.rss?.channel?.[0];

  if (!channel || typeof channel !== "object") {
    throw new Error("Goodreads returned an unexpected feed");
  }

  const items = channel.item ?? [];
  if (!Array.isArray(items)) {
    throw new Error("Goodreads returned an unexpected feed");
  }

  return items
    .map((item: unknown, index: number) =>
      item && typeof item === "object"
        ? parseBook(item as GoodreadsItem, index)
        : null,
    )
    .filter((book: GoodreadsBook | null): book is GoodreadsBook => book !== null);
}

function goodreadsShelfUrl(rssUrl: string, shelf: string): URL {
  const url = new URL(rssUrl);

  if (url.protocol !== "https:") {
    throw new Error("The Goodreads RSS URL must use HTTPS");
  }

  if (url.hostname !== "www.goodreads.com" && url.hostname !== "goodreads.com") {
    throw new Error("The RSS URL must point to Goodreads");
  }

  url.searchParams.set("shelf", shelf);
  return url;
}

export async function getGoodreadsBooks({
  rssUrl,
  shelves = ["read"],
  fetcher = (url) => fetch(url),
}: GetGoodreadsBooksOptions): Promise<GoodreadsBook[]> {
  if (shelves.length === 0) return [];

  const booksByShelf = await Promise.all(
    shelves.map(async (shelf) => {
      const response = await fetcher(goodreadsShelfUrl(rssUrl, shelf));

      if (!response.ok) {
        throw new Error(`Goodreads returned ${response.status} for ${shelf}`);
      }

      const books = await parseGoodreadsRss(await response.text());
      return books.sort((a, b) => readTime(b) - readTime(a));
    }),
  );

  const seen = new Set<string>();
  return booksByShelf.flat().filter((book) => {
    if (seen.has(book.id)) return false;

    seen.add(book.id);
    return true;
  });
}

