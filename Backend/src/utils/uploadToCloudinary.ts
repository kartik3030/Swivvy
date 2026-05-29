import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = (
    buffer: Buffer
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "profile-photos",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Upload failed"));
                    return;
                }

                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};