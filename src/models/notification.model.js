const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    isGlobal: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = Notification;
