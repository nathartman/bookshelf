# Bookshelf

Turn a Goodreads RSS feed into a tactile React bookshelf. Book covers keep their
natural proportions, while each side view scales its thickness from the book's
page count.

[See live example](https://nathartman.net/bookshelf)

## Install from GitHub

```bash
npm install github:nathartman/bookshelf#v0.2.0
```

The package ships TypeScript source. In Next.js, add the package to
`transpilePackages`:

```ts
const nextConfig = {
  transpilePackages: ["@nathartman/bookshelf"],
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

Import the stylesheet once wherever you render the shelf:

```tsx
import {
  BookList,
  getGoodreadsBooks,
} from "@nathartman/bookshelf";
import "@nathartman/bookshelf/styles.css";

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

## Theming

The stylesheet ships a neutral system-sans default and exposes every opinionated
value as a custom property. Set these on the element you pass `className` to, or
anywhere above it — custom properties inherit, so overrides never depend on
stylesheet order, cascade layers, or `!important`.

| Variable | Default | Controls |
| --- | --- | --- |
| `--bookshelf-font-family` | system sans stack | Typeface for the whole shelf |
| `--bookshelf-title-font-weight` | `600` | Book title weight |
| `--bookshelf-meta-font-weight` | `400` | Author and year weight |
| `--bookshelf-muted-color` | `#71717a` | Author and year color |
| `--bookshelf-muted-color-dark` | `#a1a1aa` | Author and year color, dark mode |
| `--bookshelf-list-margin` | `0` | Outer margin of the `<ol>` |
| `--bookshelf-list-padding` | `2rem 0` | Outer padding of the `<ol>` |
| `--bookshelf-card-padding-inline` | `0` | Horizontal gutter per card |
| `--bookshelf-fallback-font-family` | system mono stack | "No cover" placeholder |

Cards carry no horizontal padding by default, so your page container owns the
gutter. Add one back with `--bookshelf-card-padding-inline` if you want the
shelf to indent itself.

```css
.my-page-shelf {
  --bookshelf-font-family: "Instrument Sans", sans-serif;
  --bookshelf-list-margin: 0 -1.5rem;
}
```

Nothing else about your type is declared by the package. Variable-font axes set
on an ancestor — optical size, a narrowed width axis, anything driven by
`font-variation-settings` or `font-stretch` — inherit into the shelf untouched.

## What is included

- Goodreads RSS fetching and parsing
- Multiple shelf ordering and deduplication
- Responsive `BookList` and `BookCard` components
- Page-count-based book thickness
- Configurable book height and optional side views
- Lazy-loaded covers and empty-cover fallbacks

## License

MIT
