const User = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelpers");

function login(req, res) {}

async function registerUser(req, res) {
  try {
    const { fullname, email, password } = req.body;

    //check if user is existing
    const existingUser = await User.find({ $or: [{ fullname }, { email }] });
    if (existingUser.length > 0)
      return res.status(400).json({
        success: false,
        message: "User already exists in the database",
      });

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //store default profile picture to cloudinary
    const avatarFilePath = "./assets/default-avatar.jpg";
    const { url, publicId } = await uploadToCloudinary(avatarFilePath);

    //store in database
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      avatarUrl: url,
      avatarPublicId: publicId,
    });

    if (!newUser) throw new Error("Error registering user");
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { login, registerUser };
