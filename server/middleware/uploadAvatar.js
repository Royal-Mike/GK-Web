const multer = require("multer");
const path = require("path");

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const __basedir = path.join(__dirname, '/../../client');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__basedir, "assets", "upload","avatar"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-laTouch-${file.originalname}`);
    },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;