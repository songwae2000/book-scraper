import React, { useState, useEffect } from 'react';
import { Book } from './types/book';
import SearchBar from './components/SearchBar';
import BookGrid from './components/BookGrid';
import { useDebounce } from './hooks/useDebounce';

function App() {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // TODO: Implement data fetching
    // TODO: Implement search functionality
    // TODO: Implement refresh functionality

    return (
        <div className="app">
            <header>
                <h1>Book Library Scraper</h1>
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by title or author..."
                />
                <button onClick={() => { }}>Refresh Data</button>
            </header>

            <main>
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {!loading && !error && (
                    <BookGrid books={books} />
                )}
            </main>
        </div>
    );
}

export default App;