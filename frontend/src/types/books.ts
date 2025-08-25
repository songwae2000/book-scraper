export interface Book {
    id: string;
    title: string;
    authors: string[];
    coverUrl?: string;
    yearPublished?: number;
    subjects: string[];
    openLibraryUrl: string;
    scrapedAt: Date | string;
}

export interface BookApiResponse {
    success: boolean;
    data: Book[];
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    error?: string;
}

export interface SearchApiResponse {
    success: boolean;
    data: Book[];
    query: string;
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    error?: string;
}

export interface ScrapeApiResponse {
    success: boolean;
    message: string;
    booksScraped?: number;
    error?: string;
}