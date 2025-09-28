export default function BookSideView({ height, book }) {
  const containerWidth = height * 0.7;
  const coverWidth = Math.round(height * 0.015);
  const pagesWidth = (book.pageCount / 100) * (height * 0.06);
  const pagesHeight = height;
  const radius = height * 0.005;

  return (
    <>
      <style jsx>{`
        .book-container {
          width: ${containerWidth}px;
        }
        .book-cover {
          width: ${coverWidth}px;
          height: ${height}px;
          border-radius: ${radius}px;
          background-image: url("${book.coverUrl}");
          opacity: 0.7;
          background-size: cover;
          background-repeat: no-repeat;
          box-shadow: 0 0 0 0.5px rgba(153, 161, 175, 0.5);
          flex-shrink: 0;
        }
        .book-cover.left {
          background-position: right center;
        }
        .book-cover.right {
          background-position: left center;
        }
        .book-pages {
          width: ${pagesWidth}px;
          height: ${pagesHeight}px;
          background-color: white;
          background-image: url("/book-pages-overlay.png");
          background-size: cover;
          background-position: center;
          border-top: 0.5px solid #e5e7eb;
          border-bottom: 0.5px solid #e5e7eb;
          box-shadow: inset 0 -0.5px 0.5px rgba(153, 161, 175, 0.2);
        }
      `}</style>
      <div className="book-container flex items-center">
        <div className="book-cover left shadow-sm"></div>
        <div className="book-pages shadow-sm"></div>
        <div className="book-cover right shadow-sm"></div>
      </div>
    </>
  );
}
