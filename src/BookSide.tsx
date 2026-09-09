import type { GoodreadsBook } from "./types";

interface CoverEdgeProps {
  book: GoodreadsBook;
  eager: boolean;
  side: "left" | "right";
}

function CoverEdge({ book, eager, side }: CoverEdgeProps) {
  return (
    <div className={`grb-edge grb-edge-${side}`}>
      {book.coverUrl && (
        <img
          src={book.coverUrl}
          alt=""
          aria-hidden="true"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          className="grb-edge-image"
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
    <div className="grb-side" aria-hidden="true">
      <CoverEdge book={book} eager={eager} side="left" />
      <div className="grb-pages">
        <div className="grb-pages-overlay" />
      </div>
      <CoverEdge book={book} eager={eager} side="right" />
    </div>
  );
}

