const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostImage",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PostImage", postSchema);
