"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { parseDateRead } from "../lib/seasonHelper";
import { type Book } from "../lib/rssParser";
import BookDisplay from "./BookDisplay";

interface SeasonViewProps {
  books: Book[];
}

export default function SeasonView({ books }: SeasonViewProps) {
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);

  // Get current date information
  const currentDateInfo = parseDateRead();

  // Group books by season-year, ordered starting from current season/year then going back chronologically
  const groupedBySeason = useMemo(() => {
    const groups: Record<
      string,
      { season: string; year: number; books: Book[] }
    > = {};

    for (const book of books) {
      const { season, year } = parseDateRead(book.readDate);
      const key = `${year}-${season}`;
      if (!groups[key]) groups[key] = { season, year, books: [] };
      groups[key].books.push(book);
    }

    const order = ["winter", "spring", "summer", "fall"] as const;
    const seasonIndex = (s: string) => order.indexOf(s as any);

    const entries = Object.values(groups);
    entries.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year; // newer year first
      return seasonIndex(b.season) - seasonIndex(a.season); // later season in year first
    });

    // rotate so current season/year is first
    const currentKeyIdx = entries.findIndex(
      (g) =>
        g.year === currentDateInfo.year && g.season === currentDateInfo.season
    );
    if (currentKeyIdx > 0) {
      return [
        ...entries.slice(currentKeyIdx),
        ...entries.slice(0, currentKeyIdx),
      ];
    }
    return entries;
  }, [books, currentDateInfo.season, currentDateInfo.year]);

  // Load more books function - use batch size of 20 for seasonal view
  const loadMoreBooks = useCallback(() => {
    if (loadingMore || !hasMoreBooks) return;

    setLoadingMore(true);
    const currentLength = displayedBooks.length;
    const nextBatch = books.slice(currentLength, currentLength + 20);

    if (nextBatch.length === 0) {
      setHasMoreBooks(false);
      setLoadingMore(false);
      return;
    }

    setTimeout(() => {
      setDisplayedBooks((prev) => [...prev, ...nextBatch]);
      setLoadingMore(false);
    }, 300);
  }, [books, displayedBooks.length, loadingMore, hasMoreBooks]);

  useEffect(() => {
    // Load initial batch of 20 books
    const initialBooks = books.slice(0, 20);
    setDisplayedBooks(initialBooks);
    setHasMoreBooks(books.length > 20);
  }, [books]);

  return (
    <div className="">
      <div className="">
        {groupedBySeason.map((group) => (
          <div key={`${group.year}-${group.season}`} className="flex flex-col gap-10 px-11 pt-11 pb-16 border-b border-muted">
            <div className="flex gap-2 items-center">
              <h2 className="text-4xl text-default garamond-text tracking-tight">{group.season}</h2>
              <p className="text-xs text-subtle font-mono">
                {group.year}
              </p>{" "}
            </div>
            <div className="flex flex-wrap gap-16">
              {group.books.map((book) => (
                <BookDisplay
                  key={`${book.isbn || "noisbn"}-${book.readDate}-${
                    book.title
                  }-${book.author}`}
                  height={180}
                  book={book}
                  hasSide={true}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
