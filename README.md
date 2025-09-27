# Goodreads Bookshelf

A simple web app that displays your recently read books from Goodreads in a clean list format. Shows cover image, title, author, publication year, page count.

## Setup

1. **Clone and install**
   ```bash
   git clone your-repo-url
   cd goodreads-bookshelf
   npm install
   ```

2. **Get your Goodreads RSS URL**
   - On Goodreads, go to the Bookshelf you want to display
   - Scroll to the bottom and look for the RSS icon
   - Copy the RSS URL (it will look like `https://www.goodreads.com/review/list_rss/...`)

3. **Add your RSS URL**
   
   **Option A:** Edit the config file
   - Open `config/rss.js`
   - Replace the existing URL with your RSS URL
   
   **Option B:** Use environment variable  
   - Set `GOODREADS_RSS_URL=your-rss-url-here`

4. **Run the app**
   ```bash
   npm run dev
   ```

## Deployment

This works on any platform that supports Next.js (Vercel, Netlify, etc).

Built with Next.js, React, and Tailwind CSS