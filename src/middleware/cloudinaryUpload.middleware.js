// middleware/cloudinaryUpload.middleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary'); // ⬅️ make sure this exports a configured cloudinary instance

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'courses',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

const upload = multer({ storage });
module.exports = upload;
