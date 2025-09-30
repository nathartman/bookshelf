"use client";

import { useState, useEffect, useCallback } from "react";
import BookFront from "./BookFront";
import { type Book } from "../lib/rssParser";

interface GridViewProps {
  books: Book[];
}

export default function GridView({ books }: GridViewProps) {
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);

  // Load more books function - use batch size of 15 for grid layout
  const loadMoreBooks = useCallback(() => {
    if (loadingMore || !hasMoreBooks) return;

    setLoadingMore(true);
    const currentLength = displayedBooks.length;
    const nextBatch = books.slice(currentLength, currentLength + 15);

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
    // Load initial batch of 15 books
    const initialBooks = books.slice(0, 15);
    setDisplayedBooks(initialBooks);
    setHasMoreBooks(books.length > 15);
  }, [books]);

  return (
    <div className="">
      <div className="grid grid-cols-3 gap-4 p-6">
        {displayedBooks.map((book) => (
          <div key={book.isbn} className="col-span-1">
            <BookFront book={book} height={200} />
          </div>
        ))}
      </div>
      {loadingMore && (
        <div className="text-center py-4">
          <div className="font-mono text-sm text-gray-500">Loading more books...</div>
        </div>
      )}
      {!hasMoreBooks && displayedBooks.length > 0 && (
        <div className="text-center py-2">
          <div className="font-mono text-sm text-gray-500">
            Showing {displayedBooks.length} of {books.length} books
          </div>
        </div>
      )}
    </div>
  );
}
