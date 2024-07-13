const multer = require("multer");
const path = require("path");

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const textFileFilter = (req, file, cb) => {
    if (file.mimetype === "text/plain") {
        cb(null, true);
    } else {
        cb("Please upload only text files.", false);
    }
};

const __basedir = path.join(__dirname, '/../../client');

var storageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__basedir, "assets", "upload", "avatar"));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

var storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__basedir, "assets", "upload", "attachment"));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

var uploadAvatar = multer({ storage: storageAvatar, fileFilter: imageFilter });
var uploadFile = multer({ storage: storageFile });
var uploadReq = multer({ storage: storageFile, fileFilter: textFileFilter });

module.exports = {
    uploadAvatar,
    uploadFile,
    uploadReq
};
