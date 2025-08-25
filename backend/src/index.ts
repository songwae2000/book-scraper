import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/books';
import { connectDB } from './config/database';

// Environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Increase timeout for long-running operations like scraping
app.use((req, res, next) => {
    res.setTimeout(300000); // 5 minutes timeout
    next();
});

// Middleware to handle CORS and JSON requests
app.use(cors());
app.use(express.json());

// Health check endpoint to check if the server is running
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API routes to handle book requests
app.use('/api/books', bookRoutes);

// Handling middleware to handle error
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 Book Scraper API ready at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();