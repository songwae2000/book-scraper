export interface Book {
    id: string;
    title: string;
    authors: string[];
    coverUrl?: string;
    yearPublished?: number;
    subjects: string[];
    openLibraryUrl: string;
    scrapedAt: Date;
}