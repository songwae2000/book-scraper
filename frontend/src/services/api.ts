import axios, { AxiosResponse } from 'axios';
import { BookApiResponse, SearchApiResponse, ScrapeApiResponse } from '../types/books';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000, // 5 minutes timeout for scraping operations
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        
        if (error.response?.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        if (error.response?.status >= 500) {
            throw new Error('Server error. Please try again later.');
        }
        
        throw new Error(error.response?.data?.error || 'An unexpected error occurred');
    }
);

export interface BooksParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    genre?: string;
}

export interface SearchParams extends BooksParams {
    q: string;
}

export const booksApi = {
    // Get all books with pagination and sorting
    getBooks: async (params: BooksParams = {}): Promise<BookApiResponse> => {
        const response = await api.get('/books', { params });
        return response.data;
    },

    // Search books
    searchBooks: async (params: SearchParams): Promise<SearchApiResponse> => {
        const response = await api.get('/books/search', { params });
        return response.data;
    },

    // Trigger scraping
    scrapeBooks: async (): Promise<ScrapeApiResponse> => {
        const response = await api.post('/books/scrape');
        return response.data;
    },

    // Get statistics
    getStats: async () => {
        const response = await api.get('/books/stats');
        return response.data;
    },
};

export default api;
