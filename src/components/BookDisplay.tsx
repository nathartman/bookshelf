import { type Book } from "../lib/rssParser";
import BookFront from "./BookFront";
import BookSide from "./BookSide";

interface BookDisplayProps {
  height: number;
  book: Book;
  hasSide: boolean;
}

export default function BookDisplay({ height, book, hasSide }: BookDisplayProps) {
  return (
    <div className="">
      <div className="flex gap-4 shrink-0">
        <BookFront height={height} book={book} />
        {hasSide && <BookSide height={height} book={book} />}
      </div>
    </div>
  );
}