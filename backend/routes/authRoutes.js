const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

//  Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, university, department, year, semester } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, university, department, year, semester },
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