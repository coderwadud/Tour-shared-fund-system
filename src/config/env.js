require("dotenv").config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI || "your_default_mongodb_uri",
  JWT_SECRET: process.env.JWT_SECRET || "your_default_jwt_secret",
  PORT: process.env.PORT || 5000,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};