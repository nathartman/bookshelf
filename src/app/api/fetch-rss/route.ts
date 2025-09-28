import { RSS_URL } from '../../../../config/rss';
import { parseRSSToBooks } from '../../../../lib/rssParser';

export async function GET(): Promise<Response> {
  try {
    console.log('Fetching RSS from:', RSS_URL);

    const response = await fetch(RSS_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('RSS fetched successfully, parsing...');

    const books = await parseRSSToBooks(xmlText);
    console.log(`Parsed ${books.length} books`);

    return Response.json(books);
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return Response.json(
      { error: 'Failed to fetch RSS feed' },
      { status: 500 }
    );
  }
}