const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// FIXME this is currently broken in production mode on vercel
export default async function uploadHandler(req, res) {
  const upload = multer({ storage }).single('file');

  upload(req, res, error => {
    if (error) {
      return res.status(500);
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const path = req.file.path;

    cloudinary.uploader.upload(path, { resource_type: 'raw' }, function (error, image) {
      if (error) {
        return res.status(500);
      }

      try {
        fs.unlinkSync(path);
        res.status(200).json({ data: image.secure_url });
      } catch {
        return res.status(500);
      }
    });
  });
}
