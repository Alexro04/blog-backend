const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  editPost,
  getAllPostByUser,
} = require("../controllers/posts-controller");
const authMiddleware = require("../middleware/auth-middlware");
const multer = require("../middleware/upload-middleware");

const router = express.Router();

router.post("/create", authMiddleware, multer.single("post-image"), createPost);
router.get("/get/:userId", getAllPostByUser);
router.post(
  "/edit/:postId",
  authMiddleware,
  multer.single("post-image"),
  editPost
);
router.get("/delete/:postId", authMiddleware, deletePost);
router.get("/post/:postId", getPost);
router.get("/all", getPosts);

module.exports = router;
