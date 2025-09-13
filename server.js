import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jewelryRouter from './routes/jewelry.js';
import categoryRouter from './routes/category.js';
import authRouter from './routes/auth.js';
import path from 'path';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Serve static files from public folder
app.use('/public', express.static(path.join(path.resolve(), 'public')));
app.use('/images', express.static(path.join(path.resolve(), 'public', 'images')));
app.use('/videos', express.static(path.join(path.resolve(), 'public', 'videos')));
// Fallback for old uploads directory (backward compatibility)
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/jewelry-diary';
mongoose.connect(MONGO, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Middleware to check if database is connected
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/jewelry', jewelryRouter);
app.use('/api/categories', categoryRouter);

app.get('/', (req, res) => res.send('Jewelry Diary API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
