const cloudinary = require('cloudinary').v2;
const multer = require('multer');

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
    console.log(file);
    cb(null, file.originalname);
  },
});

export default async function (req, res, next) {
  const upload = multer({ storage }).single('file');

  upload(req, res, function (err) {
    if (err) return res.send(err);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const path = req.file.path;

    cloudinary.uploader.upload(path, { resource_type: 'raw' }, function (err, image) {
      console.log(err);

      if (err) return res.send(err);
      // remove file from server
      const fs = require('fs');
      try {
        fs.unlinkSync(path);
      } catch {
        console.log('error');
      }
      // return image details
      res.json({ data: image.secure_url });
    });
  });
}
