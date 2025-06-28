const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    paymentReference: String,
    paid: {
      type: Boolean,
      default: false
    },
    accessGranted: {
      type: Boolean,
      default: false
    },
    amountPaid: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);
