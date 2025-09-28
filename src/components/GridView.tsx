import BookFront from "./BookFront";
import { type Book } from "../../lib/rssParser";

interface GridViewProps {
  books: Book[];
}

export default function GridView({ books }: GridViewProps) {
  return (
    <div className="">
      <div className="grid grid-cols-3 gap-4 p-6">
        {books.map((book) => (
          <div key={book.isbn} className="col-span-1">
            <BookFront book={book} height={200} />
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-500 mt-2">
        {books.length} books loaded
      </div>
    </div>
  );
}
