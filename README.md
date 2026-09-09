# Goodreads Bookshelf

Turn a Goodreads RSS feed into a tactile React bookshelf. Book covers keep their
natural proportions, while each side view scales its thickness from the book's
page count.

[See it on nat-hartman.net](https://nat-hartman-dot-net.vercel.app/bookshelf)

## Install from GitHub

```bash
npm install github:nathartman/goodreads-bookshelf-ui#v0.1.0
```

This first release ships TypeScript source. In Next.js, add the package to
`transpilePackages`:

```ts
const nextConfig = {
  transpilePackages: ["@nathartman/goodreads-bookshelf"],
};

export default nextConfig;
```

## Add your Goodreads feed

Find the RSS link at the bottom of a Goodreads shelf, then save it somewhere
only your server can read it:

```bash
GOODREADS_RSS_URL="https://www.goodreads.com/review/list_rss/YOUR_ID?key=YOUR_KEY"
```

## Render the shelf

```tsx
import {
  BookList,
  getGoodreadsBooks,
} from "@nathartman/goodreads-bookshelf";

export default async function BookshelfPage() {
  const books = await getGoodreadsBooks({
    rssUrl: process.env.GOODREADS_RSS_URL!,
    shelves: ["currently-reading", "read"],
    fetcher: (url) => fetch(url, { next: { revalidate: 86400 } }),
  });

  return (
    <BookList
      books={books}
      bookHeight={{ mobile: 200, desktop: 160 }}
    />
  );
}
```

Shelves appear in the order you provide them. Duplicate books are removed, and
books within each shelf are ordered by read date when Goodreads provides one.

Pass a single number when you want the same size everywhere:

```tsx
<BookList books={books} bookHeight={180} />
```

## What is included

- Goodreads RSS fetching and parsing
- Multiple shelf ordering and deduplication
- Responsive `BookList` and `BookCard` components
- Page-count-based book thickness
- Configurable book height and optional side views
- Lazy-loaded covers and empty-cover fallbacks

## License

MIT
