import { type Book } from "../lib/rssParser";

interface BookFrontProps {
  height: number;
  book: Book;
}

export default function BookFront({ height, book }: BookFrontProps) {
  const leftRadius = height * 0.005;
  const rightRadius = height * 0.01;

  return (
    <div
      className="relative shadow-sm bg-stone-50"
      style={{
        height: `${height}px`,
        aspectRatio: "2/3",
      }}
    >
      <img
        src={book.coverUrl}
        alt={book.title}
        className="object-cover opacity-85 w-full h-full"
        style={{
          borderRadius: `${leftRadius}px ${rightRadius}px ${rightRadius}px ${leftRadius}px`,
          boxShadow: "inset 0 2px 0px 2px rgba(153, 161, 175, 1)",
          mixBlendMode: "darken",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: "url('/book-overlay.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: `${leftRadius}px ${rightRadius}px ${rightRadius}px ${leftRadius}px`,
        }}
      />
    </div>
  );
}
