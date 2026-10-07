const express = require('express');
const router = express.Router();
const { addCourse, getCourses, deleteCourse } = require('../controllers/courseController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, addCourse);
router.get('/', verifyToken, getCourses);
router.delete('/:id', verifyToken, deleteCourse);

module.exports = router;