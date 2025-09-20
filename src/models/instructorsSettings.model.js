// models/instructorSettings.model.js
const mongoose = require('mongoose');

const instructorSettingsSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One settings document per instructor
    },
    emailNotifications: { type: Boolean, default: true },
    courseEnrollments: { type: Boolean, default: true },
    newMessages: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.InstructorSettings ||
  mongoose.model('InstructorSettings', instructorSettingsSchema);
