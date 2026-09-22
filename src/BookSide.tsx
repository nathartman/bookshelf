import type { GoodreadsBook } from "./types";

interface CoverEdgeProps {
  book: GoodreadsBook;
  eager: boolean;
  side: "left" | "right";
}

function CoverEdge({ book, eager, side }: CoverEdgeProps) {
  return (
    <div className={`bookshelf-edge bookshelf-edge-${side}`}>
      {book.coverUrl && (
        <img
          src={book.coverUrl}
          alt=""
          aria-hidden="true"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          className="bookshelf-edge-image"
        />
      )}
    </div>
  );
}

export interface BookSideProps {
  book: GoodreadsBook;
  eager?: boolean;
}

export function BookSide({ book, eager = false }: BookSideProps) {
  return (
    <div className="bookshelf-side" aria-hidden="true">
      <CoverEdge book={book} eager={eager} side="left" />
      <div className="bookshelf-pages">
        <div className="bookshelf-pages-overlay" />
      </div>
      <CoverEdge book={book} eager={eager} side="right" />
    </div>
  );
}

