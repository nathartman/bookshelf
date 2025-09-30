"use client";

import { useState, useEffect, useCallback } from "react";
import BookCard from "./BookCard";
import { type Book } from "../lib/rssParser";

interface ListView2Props {
  books: Book[];
}

export default function ListView2({ books }: ListView2Props) {
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);

  // Load more books function (for manual loading if needed)
  const loadMoreBooks = useCallback(() => {
    if (loadingMore || !hasMoreBooks) return;

    setLoadingMore(true);
    const currentLength = displayedBooks.length;
    const nextBatch = books.slice(currentLength, currentLength + 10);

    if (nextBatch.length === 0) {
      setHasMoreBooks(false);
      setLoadingMore(false);
      return;
    }

    setTimeout(() => {
      setDisplayedBooks(prev => [...prev, ...nextBatch]);
      setLoadingMore(false);
    }, 300);
  }, [books, displayedBooks.length, loadingMore, hasMoreBooks]);

  useEffect(() => {
    // Load initial batch of 10 books
    const initialBooks = books.slice(0, 10);
    setDisplayedBooks(initialBooks);
    setHasMoreBooks(books.length > 10);
  }, [books]);

  return (
    <div className="">
      <div className="sm:hidden flex flex-col gap-16 py-16">
        {displayedBooks.map((book, index) => (
          <BookCard key={index} bookHeight={200} book={book} />
        ))}
      </div>
      <div className="hidden sm:block">
        {displayedBooks.map((book, index) => (
          <BookCard key={index} bookHeight={160} book={book} />
        ))}
      </div>
      {loadingMore && (
        <div className="py-8 text-center">
          <div className="font-mono text-sm text-gray-500">Loading more books...</div>
        </div>
      )}
      {!hasMoreBooks && displayedBooks.length > 0 && (
        <div className="py-4 text-center">
          <div className="font-mono text-sm text-gray-500">
            Showing {displayedBooks.length} of {books.length} books
          </div>
        </div>
      )}
    </div>
  );
}
