const express = require("express");
const { createPost, getAllPosts } = require("../controllers/posts-controller");
const authMiddleware = require("../middleware/auth-middlware");

const router = express.Router();

router.post("/create", createPost);
router.get("/all", authMiddleware, getAllPosts);

module.exports = router;
