const Post = require("../models/Post");

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find();
    if (posts.length > 0)
      return res.status(200).json({
        success: true,
        message: "All posts loaded successfully",
        data: posts,
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

function getPost(req, res) {}

function createPost(req, res) {
  const { title, content, tags } = req.body;

  const newPost = Post.create({
    title,
    content,
    tags,
  });

  if (newPost)
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
    });
  else
    return res.status(201).json({
      success: false,
      message: "Error creating post",
    });
}

function deletePost(req, res) {}

function editPost(req, res) {}

module.exports = { createPost, getAllPosts, getPost, deletePost, editPost };
