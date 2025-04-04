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
    throw new Error(error.message);
  }
}

async function deleteFromCloudinary(publicId) {
  try {
    const deletedResult = await cloudinary.uploader.destroy(publicId);
    console.log(deletedResult);
    return deletedResult;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { uploadToCloudinary, deleteFromCloudinary };
