const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const checkFileType = (file, cb) => {
  // Accept jpg, jpeg, png, webp, gif
  const filetypes = /jpg|jpeg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else if (file.mimetype.startsWith('image/')) {
    // Accept anything the browser reports as an image
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max per file
});

module.exports = upload;
