import type { GoodreadsBook } from "./types";

export interface BookFrontProps {
  book: GoodreadsBook;
  eager?: boolean;
}

export function BookFront({ book, eager = false }: BookFrontProps) {
  return (
    <div className="grb-front">
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          className="grb-cover-image"
        />
      ) : (
        <div className="grb-cover-fallback">No cover</div>
      )}

      <div aria-hidden="true" className="grb-cover-overlay" />
    </div>
  );
}

