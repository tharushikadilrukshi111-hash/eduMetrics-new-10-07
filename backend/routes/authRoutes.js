const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Profile Update Route
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, university, department, year, semester, profilePic } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, university, department, year, semester, profilePic },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;