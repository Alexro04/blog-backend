const { uploadToCloudinary } = require("../helpers/cloudinaryHelpers");
const Post = require("../models/Post");
const PostImage = require("../models/PostImage");
const User = require("../models/User");

async function getPosts(req, res) {
  try {
    // pagination
    const totalNumberOfPost = await Post.countDocuments();
    const limit = req.query.limit || 1;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalNumberOfPost / limit);

    //sorting
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const sortObj = [];
    sortObj[sortBy] = sortOrder;

    const posts = await Post.find().limit(limit).skip(skip).sort(sortObj);

    if (posts.length > 0)
      return res.status(200).json({
        success: true,
        message: "Posts loaded successfully",
        data: posts,
        page,
        totalPages,
      });
    else
      return res.status(400).json({
        success: false,
        message: "No post in the database",
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getPost(req, res) {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate();

    if (post)
      return res.status(200).json({
        success: true,
        message: "Post loaded successfully",
        data: post,
      });
    else
      return res.status(200).json({
        success: false,
        message: `Post with the id ${postId} was not found in the database`,
        data: post,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function createPost(req, res) {
  try {
    const { title, content, tags, imageDescription } = req.body;
    const { email } = req.userInfo;
    let image;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Error getting user");

    //add the blog image to cloudinary if it exists and store in db
    if (req.file) {
      const { url, publicId } = await uploadToCloudinary(req.file.path);
      const newPostImage = await PostImage.create({
        url,
        publicId,
        description: imageDescription,
      });
      image = newPostImage._id;
    }

    // testing
    if (!title && !content) {
      title = "For Test's sake";
      content = "Testingindinw";
      tags = ["test1", "test2"];
    }

    // create new post and store in db
    const newPost = new Post({
      title,
      content,
      tags,
      author: user._id,
    });
    if (image) newPost.image = image;
    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({
      success: false,
      message: error.message,
    });
  }
}

function deletePost(req, res) {
  const postId = req.params.postId;

  //delete associated Post-Image from cloudinary

  //delete associated Post-Image and Post from database
}

function editPost(req, res) {}

module.exports = { createPost, getPosts, getPost, deletePost, editPost };
