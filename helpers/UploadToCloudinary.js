import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = (buffer) => {
   return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
         {
            resource_type: "auto",
            folder: "news",
         },
         (error, result) => {
            if (error) return reject(error);
            resolve(result);
         },
      );

      streamifier.createReadStream(buffer).pipe(stream);
   });
};
