import BookCard from "./BookCard";

export default function ListView({ books }) {
  return (
    <div className="">
      <div className="sm:hidden flex flex-col gap-16 py-16">
        {books.map((book, index) => (
          <BookCard key={index} bookHeight={200} book={book} />
        ))}
      </div>
      <div className="hidden sm:block">
        {books.map((book, index) => (
          <BookCard key={index} bookHeight={160} book={book} />
        ))}
      </div>
    </div>
  );
}
