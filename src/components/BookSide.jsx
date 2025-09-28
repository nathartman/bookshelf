export default function BookSideView({ height, book }) {
  const containerWidth = height * 0.7;
  const coverWidth = Math.round(height * 0.012);
  const pagesWidth = (book.pageCount / 100) * (height * 0.06);
  const pagesHeight = height * 0.995;
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
          background-color: #DEDCDA;
          opacity: 0.7;
          box-shadow: 0 0 0 0.5px rgba(153, 161, 175, 0.5);
          flex-shrink: 0;
          position: relative;
        }
        .book-cover::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("${book.coverUrl}");
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: ${radius}px;
          mix-blend-mode: plus-darker;
        }
        .book-cover.left::after {
          background-position: right center;
        }
        .book-cover.right::after {
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
        <div className="book-cover right shadow-sm bg-stone-100"></div>
      </div>
    </>
  );
}
