import express from 'express';
import cors from 'cors';
import bookRoutes from './routes/books';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// TODO: Implement routes
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});