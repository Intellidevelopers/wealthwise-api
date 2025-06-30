const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [{
    questionId: String,
    selected: String,
    correct: Boolean
  }],
  score: Number
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
