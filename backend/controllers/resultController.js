const Result = require('../models/Result');
const Response = require('../models/Response');
const Test = require('../models/Test');

const submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const test = await Test.findById(testId).populate('questions');
    if (!test) return res.status(404).json({ message: 'Test not found' });

    let scoredMarks = 0, correctCount = 0, wrongCount = 0, skippedCount = 0;

    test.questions.forEach((question) => {
      const answer = answers.find(a => a.question === question._id.toString());
      if (!answer || answer.selectedOption === null) {
        skippedCount++;
      } else if (answer.selectedOption === question.correctAnswer) {
        scoredMarks += question.marks;
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const response = await Response.create({
      student: req.user._id, test: testId,
      answers, submittedAt: Date.now(), isSubmitted: true
    });

    const percentage = parseFloat(((scoredMarks / test.totalMarks) * 100).toFixed(2));

    const result = await Result.create({
      student: req.user._id, test: testId, response: response._id,
      totalMarks: test.totalMarks, scoredMarks, correctCount,
      wrongCount, skippedCount, percentage, passed: percentage >= 40
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id }).populate('test', 'title');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('test')
      .populate({ path: 'response', populate: { path: 'answers.question' } });
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitTest, getMyResults, getResultById };