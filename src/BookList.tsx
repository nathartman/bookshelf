import { BookCard } from "./BookCard";
import type { BookHeight, GoodreadsBook } from "./types";

export interface BookListProps {
  books: GoodreadsBook[];
  bookHeight?: BookHeight;
  eagerCount?: number;
  showSide?: boolean;
  className?: string;
}

export function BookList({
  books,
  bookHeight,
  eagerCount = 1,
  showSide = true,
  className = "",
}: BookListProps) {
  return (
    <ol className={`bookshelf-list ${className}`.trim()}>
      {books.map((book, index) => (
        <BookCard
          key={book.id}
          book={book}
          bookHeight={bookHeight}
          eager={index < eagerCount}
          showSide={showSide}
        />
      ))}
    </ol>
  );
}

