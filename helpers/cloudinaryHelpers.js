const cloudinary = require("../config/cloudinary");

async function uploadToCloudinary(file) {
  try {
    const uploadedResult = await cloudinary.uploader.upload(file);
    console.log(uploadedResult);
    return {
      url: uploadedResult.secure_url,
      publicId: uploadedResult.public_id,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadToCloudinary };
