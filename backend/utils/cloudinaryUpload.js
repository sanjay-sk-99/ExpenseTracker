const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ExpenseTracker', // Optional folder in Cloudinary
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    // Convert buffer to stream and upload to Cloudinary
    require('stream').Readable.from(buffer).pipe(uploadStream);
  });
};

module.exports = { uploadToCloudinary };