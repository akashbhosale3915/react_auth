import { v2 } from "cloudinary";
import { config as dotenv } from "dotenv";

dotenv();

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { v2 as cloudinaryConfig };
