const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  credits: { type: Number, required: true },
  grade: { type: String, required: true, enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'E', 'F'] },
  gradePoint: { type: Number, required: true },
  semester: { type: Number, required: true },
  year: { type: Number, required: true },
  category: { type: String, enum: ['Core', 'Technical Electives', 'General'], default: 'Core' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);