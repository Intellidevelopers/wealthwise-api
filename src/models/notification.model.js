const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isGlobal: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
module.exports = Notification;
