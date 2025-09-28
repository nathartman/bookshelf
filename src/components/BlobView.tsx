import BookFront from "./BookFront";
import BookSide from "./BookSide";
import { type Book } from "../../lib/rssParser";

interface BlobViewProps {
  books: Book[];
}

export default function BlobView({ books }: BlobViewProps) {
  return (
    <div className="">
      <div className="flex flex-wrap gap-3 p-6">
        {books.map((book) => (
          <div key={book.isbn} className="flex gap-3">
            <BookFront book={book} height={120} />
            <BookSide book={book} height={120} />
          </div>
        ))}
        {books.map((book) => (
          <BookSide key={book.isbn} book={book} height={120} />
        ))}
      </div>
      <div className="text-sm text-gray-500 mt-2">
        {books.length} books loaded
      </div>
    </div>
  );
}
