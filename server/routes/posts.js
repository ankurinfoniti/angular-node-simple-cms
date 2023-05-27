const express = require("express");
const Post = require("../models/post");

const router = express.Router();

router.get("", async (req, res) => {
  const posts = await Post.find({});

  res.json({
    message: "Posts fetched successfully!",
    posts: posts,
  });
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.json(post);
});

router.post("", async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  const addedPost = await post.save();
  res
    .status(201)
    .json({ message: "Post added successfully!", postId: addedPost._id });
});

router.put("/:id", async (req, res, next) => {
  await Post.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      content: req.body.content,
    }
  );
  res.json({ message: "Update successfully!" });
});

router.delete("/:id", async (req, res, next) => {
  await Post.deleteOne({ _id: req.params.id });
  res.json({ message: "Post deleted!" });
});

module.exports = router;
