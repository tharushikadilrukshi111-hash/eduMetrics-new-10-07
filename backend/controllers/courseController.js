const Course = require('../models/Course');

// Helper function to map grades to grade points
const getGradePoint = (grade) => {
  switch (grade) {
    case 'A+': case 'A': return 4.00;
    case 'A-': return 3.70;
    case 'B+': return 3.30;
    case 'B': return 3.00;
    case 'B-': return 2.70;
    case 'C+': return 2.30;
    case 'C': return 2.00;
    case 'C-': return 1.70;
    default: return 0.00; // E or F
  }
};

// Add a new course
const addCourse = async (req, res) => {
  try {
    const { name, code, credits, grade, semester, year, category } = req.body;
    const gradePoint = getGradePoint(grade);

    const newCourse = new Course({
      student: req.user.id, // Auth middleware eken ena user id eka
      name,
      code,
      credits,
      grade,
      gradePoint,
      semester,
      year,
      category
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course added successfully!', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all courses of logged-in student
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ student: req.user.id });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, student: req.user.id });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addCourse, getCourses, deleteCourse };