import React, { useState, useEffect } from 'react';
import { Book } from '../types/books';
import { X, ExternalLink, Calendar, User, Tag, BookOpen } from 'lucide-react';

interface BookModalProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
}

const BookModal: React.FC<BookModalProps> = ({ book, isOpen, onClose }) => {
    const [imageError, setImageError] = useState(false);
    
    // Local placeholder image (no external requests)
    const placeholderImage = '/placeholder-cover-large.svg';
    // Reset image error state when book changes
    useEffect(() => {
        setImageError(false);
    }, [book?.id]);

    // Handle body scroll
    React.useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    if (!book || !isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (!imageError) {
            setImageError(true);
            e.currentTarget.src = placeholderImage;
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Book Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Book Cover */}
                        <div className="flex-shrink-0">
                            <img
                                src={imageError ? placeholderImage : (book.coverUrl || placeholderImage)}
                                alt={`Cover for ${book.title}`}
                                className="w-48 h-64 object-cover rounded-lg shadow-md"
                                onError={handleImageError}
                                onLoad={() => setImageError(false)}
                            />
                        </div>

                        {/* Book Information */}
                        <div className="flex-1 space-y-4">
                            {/* Title */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {book.title}
                                </h3>
                            </div>

                            {/* Author */}
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-gray-500" />
                                <span className="text-gray-700">
                                    {book.authors.join(', ')}
                                </span>
                            </div>

                            {/* Year Published */}
                            {book.yearPublished && (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <span className="text-gray-700">
                                        Published: {book.yearPublished}
                                    </span>
                                </div>
                            )}

                            {/* Subjects/Tags */}
                            {book.subjects && book.subjects.length > 0 && (
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Tag className="h-5 w-5 text-gray-500" />
                                        <span className="text-gray-700 font-medium">Categories:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {book.subjects.map((subject, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Scraped Date */}
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <BookOpen className="h-4 w-4" />
                                <span>
                                    Added: {new Date(book.scrapedAt).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            {/* External Link */}
                            <div className="pt-4">
                                <a
                                    href={book.openLibraryUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    <span>View Book Details</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookModal;
