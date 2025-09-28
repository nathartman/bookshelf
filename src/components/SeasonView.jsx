import { parseDateRead } from "../../lib/seasonHelper";

export default function SeasonView({ books }) {
  return (
    <div className="p-4 flex flex-col gap-2">
      {books.map((book) => (
        <div key={book.id} className="flex gap-2 items-start">
          <p className="w-[80px] text-ellipsis overflow-hidden whitespace-nowrap">{book.title}</p>
          <p>{book.author}</p>
          <p className="text-sm text-gray-500 font-mono">{parseDateRead(book.readDate).dayOfYear} {parseDateRead(book.readDate).year} {parseDateRead(book.readDate).season}</p>
        </div>
      ))}
    </div>
  );
}
