const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: { type: Number, default: null }
  }],
  startTime: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  isSubmitted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);