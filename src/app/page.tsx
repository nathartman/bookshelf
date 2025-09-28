"use client";

import { useEffect, useState } from "react";
import ListView from "../components/ListView";
import GridView from "../components/GridView";
import SeasonView from "../components/SeasonView";
import BlobView from "../components/BlobView";
import { type Book } from "../../lib/rssParser";

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="font-mono text-center">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="font-mono text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  const renderView = () => {
    if (view === "list") {
      return <ListView books={books} />;
    } else if (view === "grid") {
      return <GridView books={books} />;
    } else if (view === "season") {
      return <SeasonView books={books} />;
    } else if (view === "blob") {
      return <BlobView books={books} />;
    }
  };

  return (
    <div className="">
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 text-sm ${
              view === "list" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            list
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1 text-sm ${
              view === "grid" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            grid
          </button>
          <button
            onClick={() => setView("blob")}
            className={`px-3 py-1 text-sm ${
              view === "blob" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            blob
          </button>
          <button
            onClick={() => setView("season")}
            className={`px-3 py-1 text-sm ${
              view === "view3" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            season
          </button>
        </div>
      </div>
      {renderView()}
    </div>
  );
}
