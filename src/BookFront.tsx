import type { GoodreadsBook } from "./types";

export interface BookFrontProps {
  book: GoodreadsBook;
  eager?: boolean;
}

export function BookFront({ book, eager = false }: BookFrontProps) {
  return (
    <div className="bookshelf-front">
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          className="bookshelf-cover-image"
        />
      ) : (
        <div className="bookshelf-cover-fallback">No cover</div>
      )}

      <div aria-hidden="true" className="bookshelf-cover-overlay" />
    </div>
  );
}

