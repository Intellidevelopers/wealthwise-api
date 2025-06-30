const Quiz = require('../models/quize.model');
const Submission = require('../models/submission.model');
const Enrollment = require('../models/enrollment.model');

exports.createQuiz = async (req, res) => {
  try {
    const { title, course, questions } = req.body;
    const instructor = req.user._id;

    const quiz = await Quiz.create({ title, course, questions, instructor });
    res.status(201).json({ message: 'Quiz created', quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuizByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const isEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!isEnrolled) {
      return res.status(403).json({ message: 'Access denied: not enrolled' });
    }

    const quiz = await Quiz.findOne({ course: courseId }).select('-questions.answer');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;

    const result = quiz.questions.map((q, i) => {
      const selected = answers[i];
      const correct = q.answer === selected;
      if (correct) score++;
      return {
        questionId: q._id,
        selected,
        correct
      };
    });

    const submission = await Submission.create({
      quiz: quiz._id,
      student: req.user._id,
      answers: result,
      score
    });

    res.status(200).json({
      message: 'Quiz submitted',
      score,
      total: quiz.questions.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id }).populate('quiz');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
