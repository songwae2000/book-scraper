import React from 'react';
import { Book } from '../types/books';
import BookCard from './BookCard';

interface BookGridProps {
    books: Book[];
    loading?: boolean;
    onBookClick: (book: Book) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, loading = false, onBookClick }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="card p-4 animate-pulse">
                        <div className="skeleton w-full h-48 mb-4 rounded-lg"></div>
                        <div className="skeleton h-6 w-3/4 mb-2"></div>
                        <div className="skeleton h-4 w-1/2 mb-3"></div>
                        <div className="skeleton h-4 w-16 mb-3"></div>
                        <div className="flex gap-2 mb-3">
                            <div className="skeleton h-6 w-16 rounded-full"></div>
                            <div className="skeleton h-6 w-20 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or refresh the data.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {books.map((book) => (
                <BookCard key={book.id} book={book} onClick={() => onBookClick(book)} />
            ))}
        </div>
    );
};

export default BookGrid;
