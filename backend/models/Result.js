const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  response: { type: mongoose.Schema.Types.ObjectId, ref: 'Response', required: true },
  totalMarks: { type: Number, required: true },
  scoredMarks: { type: Number, required: true },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  skippedCount: { type: Number, default: 0 },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);