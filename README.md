# Take-Home Project: Web Scraper with Live Search

## 🎯 Project Overview
Build a full-stack web application that scrapes book data from Open Library and displays it with live search functionality. This project will demonstrate your proficiency with TypeScript, Puppeteer for web scraping, and React for building interactive UIs.

**Estimated Time**: 4-6 hours  
**Deadline**: 5 days from receipt

## 🛠 Tech Stack
- **Backend**: Node.js, Express, TypeScript, Puppeteer
- **Frontend**: React, TypeScript, Vite
- **No Database Required**: In-memory storage is sufficient

## 📋 Core Requirements

### Backend Requirements
1. **Web Scraping with Puppeteer**
   - Scrape data from Open Library's Recent Changes page
   - Extract at least 50 recently updated books
   - Collect: title, author(s), cover image, year, subjects/genres, and book URL

2. **REST API Endpoints**
   - `GET /api/books` - Returns all scraped books
   - `GET /api/books/search?q={query}` - Search functionality
   - `GET /api/books/scrape` - Triggers new data scraping

3. **Data Storage**
   - Store scraped data in-memory during server runtime
   - Data should persist between API calls (until server restarts)

### Frontend Requirements
1. **Book Display**
   - Grid/card layout showing book information
   - Display cover images (or placeholder if unavailable)
   - Show title, author, year, and genres as tags

2. **Live Search Feature**
   - Filter results as user types
   - Implement 300ms debounce
   - Search through titles and authors
   - Display "No results found" when appropriate

3. **Data Refresh**
   - Button to trigger new scraping
   - Loading states during data fetching
   - Error handling with user-friendly messages

## 🌟 Bonus Features (Optional)
- Pagination (10 items per page)
- Sorting options (title, year, author)
- Advanced error handling and retry logic
- Data caching to minimize scraping
- Loading skeletons for better UX
- Rate limiting on scrape endpoint
- Responsive design for mobile devices

## 📁 Expected Project Structure
```
book-scraper/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server setup
│   │   ├── scraper.ts        # Puppeteer scraping logic
│   │   ├── routes/
│   │   │   └── books.ts      # API route handlers
│   │   └── types/
│   │       └── book.ts       # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main application component
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   └── types/            # TypeScript interfaces
│   ├── package.json
│   └── tsconfig.json
└── README.md                  # Project documentation
```

## 📊 Evaluation Criteria

### Code Quality (40%)
- Proper TypeScript usage (avoid `any` types)
- Clean code organization and separation of concerns
- Following React and Node.js best practices
- Comprehensive error handling

### Functionality (40%)
- Successful data scraping
- Working search with debouncing
- Correct API implementation
- Responsive and intuitive UI

### Technical Decisions (20%)
- Performance considerations
- State management approach
- Clear documentation
- Handling of edge cases

## 📝 Submission Requirements

1. **GitHub Repository**
   - Public repository with all code
   - Clear commit history showing your progress

2. **Documentation (README.md)**
   - Setup and installation instructions
   - List of assumptions and decisions made
   - Known limitations or trade-offs
   - Time spent on each major component
   - Any challenges faced and how you overcame them

3. **Screenshots**
   - Include 2-3 screenshots in your README
   - Show the main interface and search functionality

4. **Optional: Live Demo**
   - Deploy frontend to Vercel/Netlify
   - Deploy backend to Render/Railway
   - Include live URLs in README

## 💡 Tips for Success

1. **Start with the scraper** - This is the core functionality
2. **Incremental development** - Get basic functionality working before adding features
3. **Test edge cases** - What happens when scraping fails? No search results?
4. **Document your approach** - Explain your technical decisions
5. **Keep it simple** - Focus on core requirements first

## 🔄 Alternative Data Sources
If you encounter issues with Open Library, you may use:
- **Books to Scrape**: http://books.toscrape.com (simpler HTML structure)
- **Goodreads Lists**: Public lists page (no login required)

## ⚠️ Important Notes

- **Do not use** Open Library's API for the core scraping requirement (you must demonstrate Puppeteer skills)
- **Respect rate limits** - Don't make excessive requests to the target website
- **Handle errors gracefully** - The app shouldn't crash if scraping fails
- **TypeScript is mandatory** - JavaScript files will not be accepted

## 📧 Questions?
If you have questions about the requirements, please email them within the first 24 hours of receiving this project. Include:
- Specific requirement you need clarified
- Your interpretation of the requirement
- Why you need clarification

## 🎁 What We're Looking For
We want to see:
- Your problem-solving approach
- How you handle real-world challenges
- Code quality and organization
- Your ability to build a complete feature from scratch
- How you communicate technical decisions

Good luck! We're excited to see what you build. 🚀

## Sample API Responses

### GET /api/books

```json{
  "success": true,
  "data": [
    {
      "id": "OL123456M",
      "title": "The Great Gatsby",
      "authors": ["F. Scott Fitzgerald"],
      "coverUrl": "https://covers.openlibrary.org/b/id/123456-M.jpg",
      "yearPublished": 1925,
      "subjects": ["Fiction", "Classic Literature", "American Literature"],
      "openLibraryUrl": "https://openlibrary.org/books/OL123456M",
      "scrapedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 50
}
```

### GET /api/books/search?q=gatsby

```json{
  "success": true,
  "data": [...],
  "query": "gatsby",
  "results": 2
}
```