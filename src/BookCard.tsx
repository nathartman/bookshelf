import type { CSSProperties } from "react";
import { BookFront } from "./BookFront";
import { BookSide } from "./BookSide";
import type { BookHeight, GoodreadsBook } from "./types";

const DEFAULT_HEIGHT: Exclude<BookHeight, number> = {
  mobile: 200,
  desktop: 160,
};

export interface BookCardProps {
  book: GoodreadsBook;
  bookHeight?: BookHeight;
  eager?: boolean;
  showSide?: boolean;
  className?: string;
}

function heightsFrom(bookHeight: BookHeight) {
  if (typeof bookHeight === "number") {
    return { mobile: bookHeight, desktop: bookHeight };
  }

  return bookHeight;
}

function geometryStyle(
  bookHeight: BookHeight,
  pageCount: number | null,
): CSSProperties {
  const { mobile, desktop } = heightsFrom(bookHeight);
  const pages = pageCount ?? 0;

  return {
    "--bookshelf-height-mobile": `${mobile}px`,
    "--bookshelf-height-desktop": `${desktop}px`,
    "--bookshelf-pages-height-mobile": `${mobile * 0.99}px`,
    "--bookshelf-pages-height-desktop": `${desktop * 0.99}px`,
    "--bookshelf-pages-width-mobile": `${(pages / 100) * (mobile * 0.05)}px`,
    "--bookshelf-pages-width-desktop": `${(pages / 100) * (desktop * 0.05)}px`,
    "--bookshelf-edge-width-mobile": `${Math.max(1, Math.round(mobile * 0.012))}px`,
    "--bookshelf-edge-width-desktop": `${Math.max(1, Math.round(desktop * 0.012))}px`,
    "--bookshelf-left-radius-mobile": `${mobile * 0.005}px`,
    "--bookshelf-left-radius-desktop": `${desktop * 0.005}px`,
    "--bookshelf-right-radius-mobile": `${mobile * 0.01}px`,
    "--bookshelf-right-radius-desktop": `${desktop * 0.01}px`,
  } as CSSProperties;
}

export function BookCard({
  book,
  bookHeight = DEFAULT_HEIGHT,
  eager = false,
  showSide = true,
  className = "",
}: BookCardProps) {
  return (
    <li
      className={`bookshelf-card ${className}`.trim()}
      style={geometryStyle(bookHeight, book.pageCount)}
    >
      <div className="bookshelf-book">
        <BookFront book={book} eager={eager} />
        {showSide && <BookSide book={book} eager={eager} />}
      </div>

      <div className="bookshelf-details">
        <div>
          <h2 className="bookshelf-title">{book.title}</h2>
          <p className="bookshelf-author">{book.author}</p>
        </div>

        {book.publishYear && <div className="bookshelf-year">{book.publishYear}</div>}
      </div>
    </li>
  );
}

