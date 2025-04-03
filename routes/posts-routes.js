const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
} = require("../controllers/posts-controller");
const authMiddleware = require("../middleware/auth-middlware");
const multer = require("../middleware/upload-middleware");

const router = express.Router();

router.post("/create", authMiddleware, multer.single("post-image"), createPost);
router.get("/post/:postId", getPost);
router.get("/all", getPosts);

module.exports = router;
