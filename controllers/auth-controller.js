const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelpers");

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // get user from database
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "The email is not registered",
      });

    //if user exists, compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    //create an accessToken after successful login
    const accessToken = jwt.sign(
      {
        fullname: user.fullname,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function registerUser(req, res) {
  try {
    const { fullname, email, password } = req.body;

    //check if user is existing
    const existingUser = await User.findOne({ $or: [{ fullname }, { email }] });
    if (existingUser)
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
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { loginUser, registerUser };
