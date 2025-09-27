export default function BookCard({ book }) {
  return (
    <div className="flex gap-6 px-16 py-6 border-b border-zinc-100">
      <img
        src={book.coverUrl}
        alt={book.title}
        className="h-40 aspect-2/3 object-cover rounded-xs shadow-xs"
      />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {book.title}
          </h3>
          <p className="text-gray-600">{book.author}</p>
        </div>
        <div className="text-sm text-gray-500">{book.pageCount} pages</div>
        <div className="text-sm text-gray-500">{book.publishYear}</div>
      </div>
    </div>
  );
}
