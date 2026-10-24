const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 

require('dotenv').config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

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

// Connect to MongoDB Atlas and start Server
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error('MONGO_URI environment variable is missing.');
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB Connected successfully!');
      
      // Server එක Port 5000 එකේ Listen වීම ආරම්භ කරයි
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
    });
}

// Export Express app for Vercel
module.exports = app;