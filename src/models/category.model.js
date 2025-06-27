const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
