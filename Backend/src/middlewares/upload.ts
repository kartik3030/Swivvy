import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";

// uploads folder path
const uploadsDir = path.join(__dirname, "../uploads");

// create uploads folder if missing
fs.mkdirSync(uploadsDir, { recursive: true });

// multer storage config
const storage = multer.diskStorage({
    destination: (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ): void => {
        cb(null, uploadsDir);
    },

    filename: (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ): void => {
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

    fileFilter: (
        req: Express.Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ): void => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image uploads are allowed"));
            return;
        }

        cb(null, true);
    },
});

export default upload;