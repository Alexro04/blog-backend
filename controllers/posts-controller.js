const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../helpers/cloudinaryHelpers");
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
    const post = await Post.findById(postId).populate("author");

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
    let { title, content, tags, imageDescription } = req.body;
    const { email } = req.userInfo;
    let image;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Error getting user");

    //test
    if (!title) {
      title = "Test with image description";
      content = "Tesing one two";
      tags = ["test", "test image"];
      imageDescription = "This is a fine image or there was no description";
    }

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function deletePost(req, res) {
  const postId = req.params.postId;
  const { email } = req.userInfo;
  try {
    const post = await Post.findById(postId)
      .populate("image")
      .populate("author");

    if (email !== post.author.email)
      return res.status(400).json({
        success: false,
        message: "Only the uploader is authorized tp delete this post",
      });

    if (post.image) {
      //delete associated Post-Image from cloudinary and database
      await deleteFromCloudinary(post.image.publicId);
      const deletedImage = await PostImage.findByIdAndDelete(post.image._id);
      if (!deletedImage) throw new Error("Error deleting Post's Image");
    }

    await post.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function editPost(req, res) {
  const postId = req.params.postId;
  const { title, content, tags, imageDescription } = req.body;
  let image = null;

  try {
    const post = await Post.findById(postId).populate("image");

    //if there's a file, delete current one from cloudinary, the database, and add the new file
    if (req.file) {
      //delete current post image
      await deleteFromCloudinary(post.image.publicId);
      await PostImage.findByIdAndDelete(post.image._id);

      //add new image to cloudinary, and database
      const { url, publicId } = await uploadToCloudinary(req.file.path);
      const newImage = await PostImage.create({
        url,
        publicId,
        // if there's an image, there has to be image description
        description: imageDescription,
      });
      image = newImage._id;
    }
    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (image) post.image = image;

    //save all changes to database
    await post.save();
    res.status(200).json({
      success: true,
      message: `Post with id: ${postId} updated successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { createPost, getPosts, getPost, deletePost, editPost };
