import BookSide from "./BookSide";
import BookFront from "./BookFront";

export default function BookCard({ book }) {
  return (
    <div className="flex px-8 py-6 border-b border-muted">
      <div className="flex gap-4 shrink-0">
        <BookFront
          height={160}
          book={book}
        />
        <BookSide
          height={160}
          book={book}
        />
      </div>
      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col">
          <h3 className="garamond-text text-xl text-default">{book.title}</h3>
          <p className="garamond-text text-lg text-subtle">{book.author}</p>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-subtle">{book.publishYear}</div>
          <div className="text-sm text-subtle">{book.pageCount} pages</div>
        </div>
      </div>
    </div>
  );
}
