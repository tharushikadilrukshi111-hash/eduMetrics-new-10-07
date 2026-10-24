
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'EduMetrics API is running!'
  });
});

// Health check + MongoDB connection status
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 503).json({
    status: 'OK',
    database: isConnected ? 'Connected' : 'Not connected'
  });
});

// Connect to MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is missing.');
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB Connected successfully!');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
    });
}

// Export Express app for Vercel
module.exports = app;
