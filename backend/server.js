
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

app.get('/', (req, res) => {
  res.json({
    message: 'EduMetrics API is running!'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK'
  });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

module.exports = app;
