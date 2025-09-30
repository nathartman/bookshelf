import xml2js from 'xml2js';

export interface Book {
  title: string;
  author: string;
  coverUrl: string;
  pageCount: number;
  publishYear: number | null;
  userRating: number;
  avgRating: number;
  readDate: string;
  isbn: string;
  description: string;
}

interface GoodreadsItem {
  title: string[];
  author_name: string[];
  book_large_image_url: string[];
  book_medium_image_url: string[];
  book_image_url: string[];
  book: Array<{
    num_pages: string[];
  }>;
  book_published: string[];
  user_rating: string[];
  average_rating: string[];
  user_read_at: string[];
  isbn: string[];
  book_description: string[];
}

interface GoodreadsRSSResult {
  rss: {
    channel: Array<{
      item: GoodreadsItem[];
    }>;
  };
}

export function parseRSSToBooks(xmlText: string): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();

    parser.parseString(xmlText, (err: Error | null, result: GoodreadsRSSResult) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const items = result.rss.channel[0].item;
        const books = items.map(item => extractBookData(item));
        resolve(books);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function extractBookData(item: GoodreadsItem): Book {
  return {
    title: item.title[0],
    author: item.author_name[0],
    coverUrl: item.book_large_image_url[0] || item.book_medium_image_url[0] || item.book_image_url[0],
    pageCount: parseInt(item.book[0].num_pages[0]) || 0,
    publishYear: parseInt(item.book_published[0]) || null,
    userRating: parseInt(item.user_rating[0]) || 0,
    avgRating: parseFloat(item.average_rating[0]) || 0,
    readDate: item.user_read_at[0],
    isbn: item.isbn[0] || '',
    description: item.book_description[0] || ''
  };
}