# Book Library Scraper

A full-stack web application that scrapes book data from Books to Scrape and
displays it with live search functionality, built with TypeScript, React,
Node.js, and MongoDB.

## Live Demo

- **Frontend**: [Deployed on Vercel](https://book-scraper-five.vercel.app/)
- **Backend**: [Deployed on Vercel](https://book-scraper-6bci.vercel.app/)

## Screenshots

### Main Interface

![Main Interface](screenshots/main-interface.png) _The main book library
interface showing the grid layout with book cards, search functionality, and
sorting options._

### Search Functionality

![Search Functionality](screenshots/search-functionality.png) _Live search in
action with debounced input, showing filtered results and search suggestions._

### Mobile Responsive Design

![Mobile Design](screenshots/mobile-design.png) _Mobile-optimized interface with
collapsible controls, touch-friendly interactions, and responsive grid layout._

## Tech Stack

### Backend

- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **Puppeteer** for web scraping
- **MongoDB** with **Mongoose** for data persistence
- **express-rate-limit** for API protection

### Frontend

- **React** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

## Core Requirements Implementation

### Backend Requirements

#### Web Scraping with Puppeteer

- **Target**: Books to Scrape (<http://books.toscrape.com>)
- **Data Extracted**: title, author(s), cover image, year, subjects/genres, book
  URL
- **Volume**: Scrapes 50+ books from multiple pages
- **Error Handling**: Comprehensive retry logic and fallback mechanisms

#### REST API Endpoints

- `GET /api/books` - Returns all books with pagination, sorting, and filtering
- `GET /api/books/search?q={query}` - Search through titles, authors, and
  subjects
- `POST /api/books/scrape` - Triggers new data scraping (rate limited)
- `GET /api/books/stats` - Returns scraping statistics
- `GET /api/books/debug` - System debugging information

#### Data Storage

- **MongoDB Atlas** for cloud-based persistence
- **Mongoose** for data modeling and validation
- **Indexes** for optimized search performance

### Frontend Requirements

#### Book Display

- **Grid Layout**: Responsive card-based design
- **Book Cards**: Cover images, title, author, year, genres
- **Modal Details**: Click to view comprehensive book information
- **Placeholder Images**: Local SVG placeholders for missing covers

#### Live Search Feature

- **300ms Debounce**: Optimized for performance
- **Multi-field Search**: Title, author, and subject search
- **Search Suggestions**: Popular authors, titles, and genres
- **No Results State**: Clear feedback when no matches found

#### Data Refresh

- **Scrape Button**: One-click data refresh
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Rate Limit Feedback**: Countdown timer for retry timing

## Bonus Features Implemented

### Advanced Features

- **Pagination**: 10 items per page with navigation
- **Sorting**: Title, author, year, and genre sorting
- **Genre Filtering**: Dropdown-based category filtering
- **Rate Limiting**: 5 requests per 2 minutes with countdown
- **Loading Skeletons**: Smooth loading animations
- **Responsive Design**: Mobile-first approach
- **Error Recovery**: Automatic retry and fallback mechanisms

## Architecture Decisions

### Database Choice: MongoDB vs In-Memory Storage

**Decision**: Used MongoDB Atlas instead of in-memory storage

**Why MongoDB is Better:**

- **Persistence**: Data survives server restarts and deployments
- **Scalability**: Can handle larger datasets and concurrent users
- **Query Flexibility**: Advanced filtering, sorting, and aggregation
- **Production Ready**: Proper indexing and performance optimization
- **Backup & Recovery**: Automatic backups and data safety
- **Real-world Usage**: Mirrors actual production environments

### Deployment Strategy: Vercel + Vercel

**Decision**: Deployed both frontend and backend on Vercel

**Why This Combination:**

- **Vercel Frontend**: Excellent React/TypeScript support, automatic
  deployments, global CDN
- **Vercel Backend**: Serverless functions with Node.js support, seamless
  integration
- **Cost Effective**: Vercel offers generous free tier for both frontend and
  backend
- **Developer Experience**: Unified platform, seamless Git integration and
  deployment
- **Performance**: Global edge network for both frontend and API

## Time Spent on Major Components

| Component                | Time Spent | Description                                               |
| ------------------------ | ---------- | --------------------------------------------------------- |
| **Backend Setup**        | 4 hours    | Express server, TypeScript config, basic routes           |
| **Web Scraping**         | 6 hours    | Puppeteer implementation, error handling, data extraction |
| **Database Integration** | 3 hours    | MongoDB setup, Mongoose models, indexing                  |
| **Frontend Setup**       | 3 hours    | React + Vite, TypeScript, Tailwind CSS                    |
| **Book Display**         | 5 hours    | Grid layout, cards, modal, responsive design              |
| **Search & Filtering**   | 4 hours    | Live search, debouncing, suggestions, pagination          |
| **Rate Limiting**        | 3 hours    | API protection, countdown timer, user feedback            |
| **Error Handling**       | 4 hours    | Comprehensive error states, fallbacks, debugging          |
| **Mobile Optimization**  | 5 hours    | Responsive design, touch interactions, mobile controls    |
| **Deployment**           | 3 hours    | Vercel setup, environment configuration                   |
| **Testing & Debugging**  | 6 hours    | Production issues, rate limit debugging, optimization     |

**Total Development Time**: ~46 hours

## Challenges Faced & Solutions

### 1. **Web Scraping Reliability**

**Challenge**: Initial scraping from Open Library was unreliable due to anti-bot
measures and complex page structure.

**Solution**:

- Switched to Books to Scrape for more reliable data
- Implemented comprehensive error handling and retry logic
- Added fallback mechanisms for failed scraping attempts
- Enhanced logging for production debugging

### 2. **Production Deployment Issues**

**Challenge**: Backend deployment on Vercel initially failed due to serverless
function limitations and Puppeteer compatibility.

**Solution**:

- Configured Vercel serverless functions for Node.js compatibility
- Optimized Puppeteer for serverless environment
- Configured environment variables correctly
- Implemented health check endpoints
- Added comprehensive debugging information

### 3. **Rate Limiting Implementation**

**Challenge**: Needed to implement user-friendly rate limiting with countdown
feedback.

**Solution**:

- Created custom rate limit middleware with detailed responses
- Built real-time countdown component with state management
- Added visual feedback for remaining requests
- Implemented proper error handling for rate limit scenarios

### 4. **Mobile Responsiveness**

**Challenge**: Complex UI needed to work seamlessly on mobile devices.

**Solution**:

- Implemented mobile-first responsive design
- Created collapsible controls for mobile screens
- Added touch-friendly interactions
- Optimized layout for different screen sizes

### 5. **Image Placeholder Issues**

**Challenge**: External placeholder URLs were causing failed network requests
and poor performance.

**Solution**:

- Created local SVG placeholder images
- Implemented smart error handling for missing images
- Added state management for image loading
- Eliminated external dependencies for placeholders

### 6. **TypeScript Integration**

**Challenge**: Ensuring type safety across the full stack while maintaining
development speed.

**Solution**:

- Defined comprehensive TypeScript interfaces
- Added proper type annotations throughout
- Implemented strict TypeScript configuration
- Used type-safe API communication

## Setup and Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI to .env
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Add your backend URL to .env
npm run dev
```

### Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://songwae2000:Myresult1%24@cluster0.dgyrgt5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
PORT=3001
```

### Frontend (.env)

```env
VITE_API_URL=https://book-scraper-6bci.vercel.app/api
```

## Known Limitations & Trade-offs

### Limitations

- **Data Source**: Limited to Books to Scrape website availability
- **Rate Limiting**: 5 scrape requests per 2 minutes
- **Image Quality**: Some book covers may be low resolution
- **Author Information**: Limited author data from source website

### Trade-offs

- **Performance vs Features**: Added complexity for better UX
- **Development Speed vs Type Safety**: TypeScript adds overhead but improves
  reliability
- **Free Tier vs Scalability**: Limited by free tier constraints
- **Simplicity vs Functionality**: More features increase complexity

## Development Commands

```bash
# Backend
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server

# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

Built with TypeScript, React, Node.js, and MongoDB
