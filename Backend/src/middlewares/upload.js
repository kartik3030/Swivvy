const multer = require("multer");
const fs = require("fs");
const path = require("path");

// uploads folder path
const uploadsDir = path.join(__dirname, "../uploads");

// create uploads folder if missing
fs.mkdirSync(uploadsDir, { recursive: true });

// multer storage config
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

// upload middleware
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image uploads are allowed"));
        }

        cb(null, true);
    },
});

module.exports = upload;