const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'lessons',
      resource_type: 'video', // ✅ CORRECT LOCATION
      allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
    };
  },
});

const uploadVideo = multer({ storage: videoStorage });

console.log('EXPORTING multer uploadVideo:', typeof uploadVideo); // ✅ should say "function"

module.exports = uploadVideo;
