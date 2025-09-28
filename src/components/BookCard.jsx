import BookSide from "./BookSide";
import BookFront from "./BookFront";

export default function BookCard({ bookHeight, book }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 px-6 sm:px-8 sm:py-6 sm:border-b border-muted">
      <div className="flex gap-4 shrink-0">
        <BookFront
          height={bookHeight}
          book={book}
        />
        <BookSide
          height={bookHeight}
          book={book}
        />
      </div>
      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col">
          <h3 className="garamond-text text-xl text-default">{book.title}</h3>
          <p className="garamond-text text-lg text-subtle">{book.author}</p>
        </div>
        <div className="flex sm:flex-col items-center sm:items-start">
          <div className="text-sm text-subtle">{book.publishYear}</div>
          <div className="text-xs text-subtle px-1 sm:hidden">•</div>
          <div className="text-sm text-subtle">{book.pageCount} pages</div>
        </div>
      </div>
    </div>
  );
}
