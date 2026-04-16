const User = require('../models/User');
const Result = require('../models/Result');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name email')
      .populate('test', 'title');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getAllResults };