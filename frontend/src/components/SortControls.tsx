import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

interface SortControlsProps {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
    disabled?: boolean;
}

const SortControls: React.FC<SortControlsProps> = ({
    sortBy,
    sortOrder,
    onSortChange,
    selectedGenre,
    onGenreChange,
    disabled = false
}) => {
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

    const sortOptions = [
        { value: 'title', label: 'Title' },
        { value: 'authors', label: 'Author' },
        { value: 'yearPublished', label: 'Year' }
    ];

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

    const handleSortChange = (newSortBy: string) => {
        const newSortOrder = newSortBy === sortBy && sortOrder === 'asc' ? 'desc' : 'asc';
        onSortChange(newSortBy, newSortOrder);
    };

    const handleGenreSelect = (genre: string) => {
        onGenreChange(genre);
        setIsGenreDropdownOpen(false);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        disabled={disabled}
                        className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                            sortBy === option.value
                                ? 'bg-black text-white border border-black'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span>{option.label}</span>
                        {sortBy === option.value && (
                            <ArrowUpDown className="h-4 w-4" />
                        )}
                    </button>
                ))}
            </div>
            
            {/* Genre Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                    disabled={disabled}
                    className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span>{selectedGenre || 'Genre'}</span>
                    <ChevronDown className="h-4 w-4" />
                </button>
                
                {isGenreDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        <div className="py-1">
                            <button
                                onClick={() => handleGenreSelect('')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                All Genres
                            </button>
                            {genreOptions.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => handleGenreSelect(genre)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="text-xs text-gray-500">
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </div>
        </div>
    );
};

export default SortControls;
