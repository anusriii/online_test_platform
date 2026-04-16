const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true },
  options: { type: [String], validate: [arr => arr.length === 4, 'Exactly 4 options required'] },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  marks: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);