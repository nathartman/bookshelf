import BookFront from "./BookFront";
import BookSide from "./BookSide";

export default function BlobView({ books }) {
  return (
    <div className="">
      <div className="flex flex-wrap gap-3 p-6">
        {books.map((book) => (
          <div key={book.id} className="flex gap-3">
            <BookFront book={book} height={120} />
            <BookSide book={book} height={120} />
          </div>
        ))}
        {books.map((book) => (
          <BookSide book={book} height={120} />
        ))}
      </div>
      <div className="text-sm text-gray-500 mt-2">
        {books.length} books loaded
      </div>
    </div>
  );
}
