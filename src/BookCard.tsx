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
    "--grb-height-mobile": `${mobile}px`,
    "--grb-height-desktop": `${desktop}px`,
    "--grb-pages-height-mobile": `${mobile * 0.99}px`,
    "--grb-pages-height-desktop": `${desktop * 0.99}px`,
    "--grb-pages-width-mobile": `${(pages / 100) * (mobile * 0.05)}px`,
    "--grb-pages-width-desktop": `${(pages / 100) * (desktop * 0.05)}px`,
    "--grb-edge-width-mobile": `${Math.max(1, Math.round(mobile * 0.012))}px`,
    "--grb-edge-width-desktop": `${Math.max(1, Math.round(desktop * 0.012))}px`,
    "--grb-left-radius-mobile": `${mobile * 0.005}px`,
    "--grb-left-radius-desktop": `${desktop * 0.005}px`,
    "--grb-right-radius-mobile": `${mobile * 0.01}px`,
    "--grb-right-radius-desktop": `${desktop * 0.01}px`,
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
      className={`grb-card ${className}`.trim()}
      style={geometryStyle(bookHeight, book.pageCount)}
    >
      <div className="grb-book">
        <BookFront book={book} eager={eager} />
        {showSide && <BookSide book={book} eager={eager} />}
      </div>

      <div className="grb-details">
        <div>
          <h2 className="grb-title">{book.title}</h2>
          <p className="grb-author">{book.author}</p>
        </div>

        {book.publishYear && <div className="grb-year">{book.publishYear}</div>}
      </div>
    </li>
  );
}

