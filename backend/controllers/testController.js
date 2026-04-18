const Test = require('../models/Test');

const createTest = async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;
    const test = await Test.create({
      title, description, duration, questions,
      totalMarks: questions.length,
      createdBy: req.user._id
    });
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true }).populate('createdBy', 'name');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('questions');
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTest = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.questions) {
      updateData.totalMarks = updateData.questions.length;
    }
    const test = await Test.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTest = async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTest, getAllTests, getTestById, updateTest, deleteTest };