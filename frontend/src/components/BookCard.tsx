import React from 'react';
import { Book } from '../types/books';
import { ExternalLink, Calendar, User } from 'lucide-react';

interface BookCardProps {
    book: Book;
    onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = 'https://via.placeholder.com/300x400?text=No+Cover';
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClick();
    };

    const handleExternalLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div 
            className="card p-4 h-full flex flex-col animate-slide-up cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] hover:bg-black hover:text-white group"
            onClick={handleCardClick}
        >
            {/* Cover Image */}
            <div className="relative mb-4">
                <img
                    src={book.coverUrl || 'https://via.placeholder.com/300x400?text=No+Cover'}
                    alt={`Cover for ${book.title}`}
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                    onError={handleImageError}
                />
                
            </div>

            {/* Book Info */}
            <div className="flex-1">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white mb-2 line-clamp-2">
                    {book.title}
                </h3>

                {/* Author */}
                <div className="flex items-center text-gray-600 group-hover:text-gray-300 mb-2">
                    <User className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">
                        {book.authors.join(', ')}
                    </span>
                </div>

                {/* Year */}
                {book.yearPublished && (
                    <div className="flex items-center text-gray-500 group-hover:text-gray-400 mb-3">
                        <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm">{book.yearPublished}</span>
                    </div>
                )}

                {/* Subjects/Tags */}
                {book.subjects && book.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                                                                {book.subjects.slice(0, 3).map((subject, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-gray-100 text-gray-800 group-hover:bg-gray-700 group-hover:text-white text-xs px-2 py-1 rounded-full"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                        {book.subjects.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{book.subjects.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-gray-100 group-hover:border-gray-700">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 group-hover:text-gray-500">
                        Scraped: {new Date(book.scrapedAt).toLocaleDateString()}
                    </span>
                    <a
                        href={book.openLibraryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on Books to Scrape"
                        // onClick={handleExternalLinkClick}
                        className="p-1 rounded-md hover:bg-gray-100 group-hover:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-gray-400" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
