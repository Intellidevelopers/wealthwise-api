const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: 'courses',
      resource_type: isVideo ? 'video' : 'image',
      format: isVideo ? 'mp4' : undefined,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      ...(isVideo
        ? {} // ✅ No transformation for videos
        : {
            transformation: [{ width: 800, height: 600, crop: 'limit' }],
          }),
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
