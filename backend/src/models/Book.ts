import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
    id: string;
    title: string;
    authors: string[];
    coverUrl?: string;
    yearPublished?: number;
    subjects: string[];
    openLibraryUrl: string;
    scrapedAt: Date;
}

const BookSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    authors: [{ type: String, required: true }],
    coverUrl: { type: String },
    yearPublished: { type: Number },
    subjects: [{ type: String }],
    openLibraryUrl: { type: String, required: true },
    scrapedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Indexes for better search performance
BookSchema.index({ title: 'text', authors: 'text' });
BookSchema.index({ yearPublished: 1 });
BookSchema.index({ scrapedAt: -1 });

export default mongoose.model<IBook>('Book', BookSchema);
