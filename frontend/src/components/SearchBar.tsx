import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    onEnter?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    value, 
    onChange, 
    placeholder = "Search books...",
    className = "",
    onEnter
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    // Search suggestions
    const searchSuggestions = {
        authors: [
            'William Shakespeare',
            'Jane Austen',
            'Charles Dickens',
            'Mark Twain',
            'Ernest Hemingway',
            'F. Scott Fitzgerald',
            'Virginia Woolf',
            'George Orwell',
            'J.R.R. Tolkien',
            'Harper Lee',
            'J.K. Rowling',
            'Stephen King',
            'Agatha Christie',
            'Arthur Conan Doyle',
            'Emily Brontë',
            'Charlotte Brontë',
            'Leo Tolstoy',
            'Fyodor Dostoevsky',
            'Gabriel García Márquez',
            'Toni Morrison',
            'Chinua Achebe',
            'Salman Rushdie',
            'Margaret Atwood',
            'Neil Gaiman',
            'Dan Brown',
            'John Grisham',
            'Paulo Coelho',
            'Khaled Hosseini',
            'Arundhati Roy',
            'Zadie Smith'
        ],
        titles: [
            'Pride and Prejudice',
            'To Kill a Mockingbird',
            '1984',
            'The Great Gatsby',
            'The Hobbit',
            'The Lord of the Rings',
            'Harry Potter',
            'The Catcher in the Rye',
            'The Alchemist',
            'The Kite Runner',
            'The Book Thief',
            'The Hunger Games',
            'The Fault in Our Stars',
            'Gone Girl',
            'The Girl on the Train',
            'The Martian',
            'Ready Player One',
            'The Handmaid\'s Tale',
            'The Testaments',
            'Normal People',
            'Where the Crawdads Sing',
            'Educated',
            'Becoming',
            'Sapiens',
            'Atomic Habits',
            'The Subtle Art of Not Giving a F*ck',
            'Rich Dad Poor Dad',
            'The 7 Habits of Highly Effective People',
            'Think and Grow Rich',
            'The Power of Now'
        ],
        genres: [
            'Fiction',
            'Non-Fiction',
            'Mystery',
            'Thriller',
            'Romance',
            'Science Fiction',
            'Fantasy',
            'Historical Fiction',
            'Biography',
            'Autobiography',
            'Memoir',
            'Self-Help',
            'Business',
            'Philosophy',
            'Psychology',
            'History',
            'Science',
            'Technology',
            'Poetry',
            'Drama',
            'Comedy',
            'Horror',
            'Adventure',
            'Young Adult',
            'Children\'s Literature',
            'Classic Literature',
            'Contemporary Fiction',
            'Literary Fiction',
            'Crime Fiction',
            'Western'
        ]
    };

    // Combine all suggestions
    const allSuggestions = [
        ...searchSuggestions.authors,
        ...searchSuggestions.titles,
        ...searchSuggestions.genres
    ];

    // Filter suggestions based on input
    useEffect(() => {
        if (value.trim() === '') {
            setFilteredSuggestions(allSuggestions.slice(0, 10)); // Show first 10 when empty
        } else {
            const filtered = allSuggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
        }
    }, [value, allSuggestions]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
    };



    return (
        <div className={`relative ${className}`} ref={searchRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && onEnter) {
                        onEnter();
                        setShowSuggestions(false);
                    }
                }}
                placeholder={placeholder}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            />
            
            {/* Search Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    <div className="py-2">
                        {filteredSuggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150"
                            >
                                <span className="text-gray-700">{suggestion}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
