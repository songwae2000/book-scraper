import puppeteer, { Browser, Page } from 'puppeteer';
import { Book } from './types/book';

export class BookScraper {
    private baseUrl = 'http://books.toscrape.com';
    private maxRetries = 3;
    private retryDelay = 2000;

    async scrapeBooks(): Promise<Book[]> {
        console.log('scraping books...');
        let browser: Browser | null = null;
        let retries = 0;

        while (retries < this.maxRetries) {
            try {
                browser = await puppeteer.launch({ 
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                
                const books = await this.performScraping(browser);
                console.log(`Successfully scraped ${books.length} books`);
                return books;
            } catch (error) {
                retries++;
                console.error(`Scraping attempt ${retries} failed:`, error);
                
                if (retries < this.maxRetries) {
                    console.log(`Retrying in ${this.retryDelay}ms...`);
                    await this.delay(this.retryDelay);
                } else {
                    console.log('All retry attempts failed. No books scraped.');
                    return [];
                }
            } finally {
                if (browser) {
                    await browser.close();
                }
            }
        }

        return [];
    }

    private async performScraping(browser: Browser): Promise<Book[]> {
        const page = await browser.newPage();
        
        // Set user agent to avoid being blocked
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Set viewport
        await page.setViewport({ width: 1920, height: 1080 });

        try {
            console.log('Navigating to Books to Scrape...');
            await page.goto(`${this.baseUrl}`, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            // Wait for content to load
            await page.waitForSelector('.product_pod', { timeout: 15000 });

            // Extract book data from multiple pages
            const allBooks: any[] = [];
            const maxPages = 3; // Scrape first 3 pages to get enough books

            for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                console.log(`Scraping page ${pageNum}...`);
                
                if (pageNum > 1) {
                    await page.goto(`${this.baseUrl}/catalogue/page-${pageNum}.html`, { 
                        waitUntil: 'networkidle2',
                        timeout: 30000 
                    });
                    await page.waitForSelector('.product_pod', { timeout: 15000 });
                }

                const pageBooks = await page.evaluate(() => {
                    const bookElements = document.querySelectorAll('.product_pod');
                    const books: any[] = [];

                    bookElements.forEach((element: Element) => {
                        try {
                            // Extract title
                            const titleElement = element.querySelector('h3 a');
                            if (!titleElement) return;

                            const title = titleElement.textContent?.trim();
                            const bookUrl = (titleElement as HTMLAnchorElement).href;
                            // Extract ID from URL 
                            const urlParts = bookUrl.split('/');
                            const filename = urlParts[urlParts.length - 2]; // Get the filename part
                            const bookId = filename || `book-${Math.random().toString(36).substr(2, 9)}`;

                            if (!title || title.length < 3) return;

                            // Extract price
                            const priceElement = element.querySelector('.price_color');
                            const price = priceElement?.textContent?.trim();

                            // Extract availability
                            const availabilityElement = element.querySelector('.availability');
                            const availability = availabilityElement?.textContent?.trim();

                            // Extract rating
                            const ratingElement = element.querySelector('.star-rating');
                            const rating = ratingElement?.className?.match(/star-rating\s+(\w+)/)?.[1] || 'None';

                            // Extract image
                            const imageElement = element.querySelector('img');
                            const imageUrl = imageElement?.getAttribute('src');
                            const fullImageUrl = imageUrl ? `http://books.toscrape.com/${imageUrl.replace('../', '')}` : undefined;

                            // Generate subjects based on rating and availability
                            const subjects = [rating, availability ? 'Available' : 'Unavailable'].filter(Boolean);

                            const book = {
                                id: bookId,
                                title,
                                authors: ['Unknown Author'], // Placeholder since Books to Scrape doesn't have author info
                                coverUrl: fullImageUrl,
                                yearPublished: undefined, // Placeholder since Books to Scrape doesn't have year info
                                subjects,
                                openLibraryUrl: bookUrl,
                                scrapedAt: new Date().toISOString()
                            };

                            books.push(book);
                        } catch (error) {
                            console.error('Error parsing book element:', error);
                        }
                    });

                    return books;
                });

                allBooks.push(...pageBooks);
                console.log(`Found ${pageBooks.length} books on page ${pageNum}`);
            }

            const limitedBooks = allBooks.slice(0, 50); // Limit to 50 books
            
            // Since Books to Scrape doesn't have author/year info, skip enrichment
            console.log('Using placeholder author names and years...');
            
            return limitedBooks;
        } catch (error) {
            console.error('Error during scraping:', error);
            console.log('Scraping failed. No books retrieved.');
            return [];
        } finally {
            await page.close();
        }
    }

    private async enrichBooksWithDetails(books: Book[]): Promise<Book[]> {
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        
        // Set a timeout to optimize page loading
        await page.setDefaultTimeout(5000);
        await page.setDefaultNavigationTimeout(5000);
        
        try {
            const enrichedBooks: Book[] = [];
            
            // Process books in smaller batches to avoid timeouts
            const batchSize = 10;
            for (let i = 0; i < books.length; i += batchSize) {
                const batch = books.slice(i, i + batchSize);
                console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(books.length/batchSize)}`);
                
                const batchPromises = batch.map(async (book) => {
                    try {
                        console.log(`Enriching book: ${book.title}`);
                        
                        // Use a shorter timeout and don't wait for network idle
                        await page.goto(book.openLibraryUrl, { 
                            waitUntil: 'domcontentloaded', 
                            timeout: 3000 
                        });
                        
                        const bookDetails = await page.evaluate(() => {
                            // Since Books to Scrape doesn't have author/year info, use placeholders
                            const authors = ['Unknown Author'];
                            const yearPublished = undefined;
                            
                            return { authors, yearPublished };
                        });
                        
                        const enrichedBook = {
                            ...book,
                            authors: bookDetails.authors,
                            yearPublished: bookDetails.yearPublished
                        };
                        
                        return enrichedBook;
                        
                    } catch (error) {
                        console.error(`Error enriching book ${book.title}:`, error);
                        return book; // Keep the original book if enrichment fails
                    }
                });
                
                // Process batch o handle individual failures
                const batchResults = await Promise.allSettled(batchPromises);
                batchResults.forEach((result) => {
                    if (result.status === 'fulfilled') {
                        enrichedBooks.push(result.value);
                    }
                });
                
                // delay between batches
                if (i + batchSize < books.length) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
            
            return enrichedBooks;
        } finally {
            await page.close();
            await browser.close();
        }
    }



    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}