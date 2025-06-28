const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length === 2;
      },
      message: 'Conversation must have exactly two participants.',
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
