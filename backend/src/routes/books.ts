import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { BookScraper } from '../scraper';
import Book from '../models/Book';

const router = express.Router();

// Rate limiting for scrape endpoint
const scrapeLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many scrape requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// GET /api/books to get all books with pagination and sorting
router.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortBy = req.query.sortBy as string || 'scrapedAt';
        const sortOrder = req.query.sortOrder as string || 'desc';
        const genre = req.query.genre as string;

        const skip = (page - 1) * limit;
        const sort: any = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Build query with genre filter
        const query: any = {};
        if (genre && genre.trim()) {
            query.subjects = { $regex: genre, $options: 'i' };
        }

        const [books, total] = await Promise.all([
            Book.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Book.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: books,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch books'
        });
    }
});

// GET /api/books/search to search books
router.get('/search', async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortBy = req.query.sortBy as string || 'scrapedAt';
        const sortOrder = req.query.sortOrder as string || 'desc';

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        const skip = (page - 1) * limit;

        // Search regex for case-insensitive search
        const searchRegex = new RegExp(query, 'i');

        // Search query
        const searchQuery = {
            $or: [
                { title: searchRegex },
                { authors: searchRegex },
                { subjects: searchRegex }
            ]
        };

        const sort: any = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const [books, total] = await Promise.all([
            Book.find(searchQuery)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Book.countDocuments(searchQuery)
        ]);

        res.json({
            success: true,
            data: books,
            query,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search books'
        });
    }
});

// POST /api/books/scrape  TO Trigger new scraping
router.post('/scrape', scrapeLimiter, async (req: Request, res: Response) => {
    try {
        const scraper = new BookScraper();
        const scrapedBooks = await scraper.scrapeBooks();

        // Save books to database
        const savedBooks = [];
        for (const book of scrapedBooks) {
            try {
                // Check if book already exists
                const existingBook = await Book.findOne({ id: book.id });
                if (existingBook) {
                    // Update existing book
                    await Book.findOneAndUpdate(
                        { id: book.id },
                        { ...book, scrapedAt: new Date() },
                        { new: true }
                    );
                } else {
                    // Create new book
                    const newBook = new Book(book);
                    await newBook.save();
                }
                savedBooks.push(book);
            } catch (error) {
                console.error(`Error saving book ${book.id}:`, error);
            }
        }

        res.json({
            success: true,
            message: `Successfully scraped and saved ${savedBooks.length} books`,
            booksScraped: savedBooks.length
        });
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to scrape books'
        });
    }
});



// GET /api/books/stats - Get scraping statistics
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const totalBooks = await Book.countDocuments();
        const latestScrape = await Book.findOne().sort({ scrapedAt: -1 });
        const booksByYear = await Book.aggregate([
            { $group: { _id: '$yearPublished', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalBooks,
                latestScrape: latestScrape?.scrapedAt,
                booksByYear: booksByYear.filter(item => item._id)
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

export default router;
