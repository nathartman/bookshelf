"use client";

import { useEffect, useState } from "react";
import ListView2 from "../components/ListView2";
import GridView from "../components/GridView";
import SeasonView from "../components/SeasonView";
import { type Book } from "../lib/rssParser";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("list");

  useEffect(() => {
    fetch("/api/fetch-rss")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }
        return res.json();
      })
      .then((data) => {
        // Sort books by readDate (most recent first)
        const sortedBooks = [...data].sort((a, b) => {
          if (!a.readDate && !b.readDate) return 0;
          if (!a.readDate) return 1;
          if (!b.readDate) return -1;

          // Convert to Date objects for proper comparison
          const dateA = new Date(a.readDate);
          const dateB = new Date(b.readDate);

          // Handle invalid dates
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;

          return dateB.getTime() - dateA.getTime(); // Most recent first
        });
        setBooks(sortedBooks);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="font-mono text-center">Loading books...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="font-mono text-center text-red-600">Error: {error}</div>
        </div>
      );
    }

    return renderView();
  };

  const renderView = () => {
    if (view === "list") {
      return <ListView2 books={books} />;
    } else if (view === "grid") {
      return <GridView books={books} />;
    } else if (view === "season") {
      return <SeasonView books={books} />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="shrink-0 p-4 border-b bg-white z-10">
        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 text-sm rounded ${
              view === "list" ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            list
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1 text-sm rounded ${
              view === "grid" ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            grid
          </button>
          <button
            onClick={() => setView("season")}
            className={`px-3 py-1 text-sm rounded ${
              view === "season" ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            season
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
