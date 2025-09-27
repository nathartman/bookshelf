import xml2js from 'xml2js';

export function parseRSSToBooks(xmlText) {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    
    parser.parseString(xmlText, (err, result) => {
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

function extractBookData(item) {
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