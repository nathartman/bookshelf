import BookCard from "./BookCard";
import { type Book } from "../../lib/rssParser";

interface ListViewProps {
  books: Book[];
}

export default function ListView({ books }: ListViewProps) {
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
