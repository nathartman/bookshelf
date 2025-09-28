import BookFront from "./BookFront";

export default function GridView({ books }) {
  return (
    <div className="">
      <div className="grid grid-cols-3 gap-4 p-6">
        {books.map((book) => (
          <div key={book.id} className="col-span-1">
            <BookFront book={book} />
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-500 mt-2">
        {books.length} books loaded
      </div>
    </div>
  );
}
