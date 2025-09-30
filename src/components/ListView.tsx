import { type Book } from "../lib/rssParser";
import BookDisplay from "./BookDisplay";

interface ListViewProps {
  books: Book[];
}

export default function ListView({ books }: ListViewProps) {
  return (
    <div>
      <div className="flex flex-col items-start gap-12 sm:gap-16 p-8 sm: max-w-xl mx-auto">
        {books.map((book, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <BookDisplay book={book} height={180} hasSide={true} />
            <div className="flex flex-col justify-center">
              <h3 className="text-xl garamond-text text-default text-balance mb-1">
                {book.title}
              </h3>
              <p className="text-lg garamond-text text-subtle mb-2 sm:mb-5">{book.author}</p>
              <p className="text-xs text-subtle tracking-wider">{book.publishYear}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
