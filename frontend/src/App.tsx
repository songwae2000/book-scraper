import { useState, useEffect, useCallback } from 'react';
import { Book } from './types/books';
import MobileHeader from './components/MobileHeader';
import BookGrid from './components/BookGrid';
import BookModal from './components/BookModal';
import Pagination from './components/Pagination';
import SortControls from './components/SortControls';
import LoadingSkeleton from './components/LoadingSkeleton';
import { useDebounce } from './hooks/useDebounce';
import { booksApi, BooksParams } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';
import RateLimitCountdown from './components/RateLimitCountdown';

function App() {
    // State management
    const [books, setBooks] = useState<Book[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [scraping, setScraping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sortBy, setSortBy] = useState<string>('title');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [stats, setStats] = useState<any>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rateLimitInfo, setRateLimitInfo] = useState<{
        remaining: number;
        resetTime: number;
        isLimited: boolean;
    } | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const itemsPerPage = 10;

    // Fetch books data
    const fetchBooks = useCallback(async (params: BooksParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            
            let response;
            // Fetch books with optional genre filter
            response = await booksApi.getBooks({
                page: currentPage,
                limit: itemsPerPage,
                sortBy,
                sortOrder,
                genre: selectedGenre,
                ...params
            });

            if (response.success) {
                setBooks(response.data);
                setTotalItems(response.total);
                setTotalPages(response.totalPages || Math.ceil(response.total / itemsPerPage));
            } else {
                throw new Error(response.error || 'Failed to fetch books');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, sortBy, sortOrder, selectedGenre]);

    // Search books
    const searchBooks = useCallback(async () => {
        if (!debouncedSearchTerm.trim()) {
            await fetchBooks();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await booksApi.searchBooks({
                q: debouncedSearchTerm,
                page: currentPage,
                limit: itemsPerPage,
                sortBy,
                sortOrder
            });

            if (response.success) {
                setBooks(response.data);
                setTotalItems(response.total);
                setTotalPages(response.totalPages || Math.ceil(response.total / itemsPerPage));
            } else {
                throw new Error(response.error || 'Failed to search books');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error searching books:', err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, currentPage, sortBy, sortOrder]);

    // Trigger scraping
    const handleScrape = async () => {
        try {
            setScraping(true);
            setError(null);
            setRateLimitInfo(null);
            
            const response = await booksApi.scrapeBooks();
            
            if (response.success) {
                // Refresh the current view after scraping
                if (debouncedSearchTerm.trim()) {
                    await searchBooks();
                } else {
                    await fetchBooks();
                }
                
                // Show success message (you could add a toast notification here)
                console.log(response.message);
            } else {
                throw new Error(response.error || 'Failed to scrape books');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            console.error('Error scraping books:', err);
            
            // Check if it's a rate limit error
            if (errorMessage.includes('Rate limit exceeded')) {
                const retryAfterMatch = errorMessage.match(/Try again in (\d+) seconds/);
                if (retryAfterMatch) {
                    const retryAfter = parseInt(retryAfterMatch[1]);
                    setRateLimitInfo({
                        remaining: 0,
                        resetTime: Date.now() + (retryAfter * 1000),
                        isLimited: true
                    });
                }
            }
        } finally {
            setScraping(false);
        }
    };

    // Fetch statistics
    const fetchStats = useCallback(async () => {
        try {
            const response = await booksApi.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    }, []);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle sort change
    const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1); // Reset to first page when sorting
    };

    // Handle genre filter change
    const handleGenreChange = (genre: string) => {
        setSelectedGenre(genre);
        setCurrentPage(1); // Reset to first page when filtering
    };

    // Handle book click
    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };

    // Effects
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        if (debouncedSearchTerm.trim()) {
            setCurrentPage(1);
            searchBooks();
        } else {
            fetchBooks();
        }
    }, [debouncedSearchTerm, selectedGenre, fetchBooks, searchBooks]);

    useEffect(() => {
        if (debouncedSearchTerm.trim()) {
            searchBooks();
        } else {
            fetchBooks();
        }
    }, [currentPage, sortBy, sortOrder]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky Header Container */}
            <div className="sticky top-0 z-50 bg-gray-50">
                {/* Mobile Header */}
                <MobileHeader
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onScrape={handleScrape}
                    scraping={scraping}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                    selectedGenre={selectedGenre}
                    onGenreChange={handleGenreChange}
                    rateLimitInfo={rateLimitInfo}
                />

                {/* Stats Bar */}
                {stats && (
                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Total Books: <strong>{scraping ? '...' : stats.totalBooks}</strong></span>
                                {stats.latestScrape && (
                                    <span>
                                        <span className="hidden sm:inline">Last Scraped: <strong>{scraping ? '...' : new Date(stats.latestScrape).toLocaleString()}</strong></span>
                                        <span className="sm:hidden">
                                            Last: <strong>{scraping ? '...' : new Date(stats.latestScrape).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</strong>
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop Controls - Sticky */}
                <div className="hidden md:block bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <SortControls
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSortChange={handleSortChange}
                                selectedGenre={selectedGenre}
                                onGenreChange={handleGenreChange}
                                disabled={scraping}
                            />
                            
                            {/* Desktop Refresh Button */}
                            <button
                                onClick={handleScrape}
                                disabled={scraping}
                                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${scraping ? 'animate-spin' : ''}`} />
                                <span>{scraping ? 'Scraping...' : 'Scrape'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Rate Limit Countdown */}
                {rateLimitInfo && <RateLimitCountdown rateLimitInfo={rateLimitInfo} />}
                
                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    </div>
                )}

                {/* Books Grid */}
                {(loading || scraping) ? (
                    <div>
                        {scraping && (
                            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <RefreshCw className="h-5 w-5 text-black mr-2 animate-spin" />
                                    <span className="text-gray-800">Scraping new books... This may take a few minutes.</span>
                                </div>
                            </div>
                        )}
                        <LoadingSkeleton count={8} />
                    </div>
                ) : (
                    <BookGrid books={books} onBookClick={handleBookClick} />
                )}

                {/* Pagination */}
                {!loading && !scraping && totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>
                )}
            </main>

            {/* Book Modal */}
            <BookModal
                book={selectedBook}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
}

export default App;