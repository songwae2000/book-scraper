import React, { useState } from 'react';
import { BookOpen, Search, RefreshCw, ChevronDown, ArrowUpDown, Filter, Instagram, Facebook } from 'lucide-react';
import SearchBar from './SearchBar';
import RateLimitCountdown from './RateLimitCountdown';

interface MobileHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onScrape: () => void;
    scraping: boolean;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
    rateLimitInfo?: {
        remaining: number;
        resetTime: number;
        isLimited: boolean;
    } | null;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
    searchTerm,
    onSearchChange,
    onScrape,
    scraping,
    sortBy,
    sortOrder,
    onSortChange,
    selectedGenre,
    onGenreChange,
    rateLimitInfo
}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

    const genreOptions = [
        'Adventure',
        'Allegory',
        'American Literature',
        'British Literature',
        'Classic Literature',
        'Coming-of-age',
        'Dystopian',
        'Fantasy',
        'Fiction',
        'Philosophical Fiction',
        'Political Fiction',
        'Romance',
        'Science Fiction',
        'Southern Literature'
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 md:border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Header */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <BookOpen className="h-8 w-8 text-primary-600" />
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Book Library</h1>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={onSearchChange}
                            placeholder="Search by title or author..."
                        />
                    </div>



                    {/* Social Media Logos */}
                    <div className="flex items-center space-x-1">
                        {/* Facebook Logo */}
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            title="Follow on Facebook"
                        >
                            <Facebook className="h-6 w-6 text-black fill-white stroke-black" />
                        </a>

                        {/* Vertical Separator */}
                        <div className="w-px h-6 bg-gray-300"></div>

                        {/* Instagram Logo */}
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            title="Follow on Instagram"
                        >
                            <Instagram className="h-6 w-6 text-black fill-white stroke-black" />
                        </a>
                    </div>
                </div>

                                    {/* Mobile Controls Row */}
                    <div className="md:hidden flex justify-between py-2">
                        {/* Mobile Refresh Button */}
                        <button
                            onClick={onScrape}
                            disabled={scraping || (rateLimitInfo?.isLimited ?? false)}
                            className="btn-primary flex items-center space-x-1 disabled:opacity-50 px-4 py-1.5"
                            title={scraping ? 'Scraping...' : 'Scrape Data'}
                        >
                            <RefreshCw className={`h-4 w-4 ${scraping ? 'animate-spin' : ''}`} />
                            <span>{scraping ? 'Scraping...' : 'Scrape'}</span>
                        </button>
                        
                        {/* Rate Limit Countdown */}
                        {rateLimitInfo && <RateLimitCountdown rateLimitInfo={rateLimitInfo} />}
                        
                        {/* Scraping Progress Indicator
                        {scraping && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                                <span>Processing books...</span>
                            </div>
                        )} */}

                        {/* Secondary Controls */}
                        <div className="flex items-center space-x-1">
                            {/* Mobile Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="Search"
                            >
                                <Search className="h-4 w-4" />
                            </button>

                            {/* Mobile Sort Button */}
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="Sort"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                            </button>

                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="Filter"
                            >
                                <Filter className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                {/* Mobile Search Popup */}
                {isSearchOpen && (
                    <div className="md:hidden fixed top-16 right-4 z-50 w-64 bg-white shadow-lg border border-gray-200 rounded-lg transform transition-transform duration-300 ease-in-out">
                        <div className="p-3">
                            {/* Search Bar */}
                            <SearchBar
                                value={searchTerm}
                                onChange={onSearchChange}
                                placeholder="Search by title or author..."
                                onEnter={() => setIsSearchOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Sort Popup */}
                {isSortOpen && (
                    <div className="md:hidden fixed top-16 right-4 z-50 w-64 bg-white shadow-lg border border-gray-200 rounded-lg transform transition-transform duration-300 ease-in-out">
                        <div className="p-4">
                            {/* Sort Options */}
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-gray-700 mb-2 block">Sort by:</span>
                                <button
                                    onClick={() => {
                                        onSortChange('title', sortBy === 'title' && sortOrder === 'asc' ? 'desc' : 'asc');
                                        setIsSortOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                        sortBy === 'title'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span>Title</span>
                                    {sortBy === 'title' && (
                                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        onSortChange('authors', sortBy === 'authors' && sortOrder === 'asc' ? 'desc' : 'asc');
                                        setIsSortOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                        sortBy === 'authors'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span>Author</span>
                                    {sortBy === 'authors' && (
                                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        onSortChange('yearPublished', sortBy === 'yearPublished' && sortOrder === 'asc' ? 'desc' : 'asc');
                                        setIsSortOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                        sortBy === 'yearPublished'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span>Year</span>
                                    {sortBy === 'yearPublished' && (
                                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Filter Popup */}
                {isFilterOpen && (
                    <div className="md:hidden fixed top-16 right-4 z-50 w-64 bg-white shadow-lg border border-gray-200 rounded-lg transform transition-transform duration-300 ease-in-out">
                        <div className="p-4">
                            {/* Genre Filter */}
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-gray-700 mb-2 block">Filter by Genre:</span>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                    >
                                        <span>{selectedGenre || 'All Genres'}</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    
                                    {isGenreDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-32 overflow-y-auto">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        onGenreChange('');
                                                        setIsGenreDropdownOpen(false);
                                                    }}
                                                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    All Genres
                                                </button>
                                                {genreOptions.map((genre) => (
                                                    <button
                                                        key={genre}
                                                        onClick={() => {
                                                            onGenreChange(genre);
                                                            setIsGenreDropdownOpen(false);
                                                        }}
                                                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        {genre}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Backdrop for Search */}
                {isSearchOpen && (
                    <div 
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsSearchOpen(false)}
                    />
                )}

                {/* Backdrop for Sort */}
                {isSortOpen && (
                    <div 
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsSortOpen(false)}
                    />
                )}

                {/* Backdrop for Filter */}
                {isFilterOpen && (
                    <div 
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}
            </div>
        </header>
    );
};

export default MobileHeader;
