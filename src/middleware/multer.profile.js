import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import "../config/cloudinary.config.js"; // Ensure this path is correct

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Accepted file formats
  },
});

const upload = multer({ storage });

export default upload;
