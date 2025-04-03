const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/assets/upload");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname} - ${Date.now}.${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  if (file.mimeType.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("You can only upload an image"));
  }
}

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
