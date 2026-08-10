const multer = require('multer');

// Memory storage — files are streamed straight to Cloudinary in the controller,
// nothing touches disk (works the same on any host, including free tiers with
// ephemeral filesystems).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per logo
});

// Accepts up to 10 files under the field name "logos" — one per company,
// in the same order as the `companies` array sent in the request body.
module.exports = upload.array('logos', 10);
