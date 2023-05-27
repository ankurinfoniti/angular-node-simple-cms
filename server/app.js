const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();
const port = process.env.port || 3000;

mongoose.connect("mongodb://localhost:27017/simple-cms");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/api/posts", async (req, res) => {
  const posts = await Post.find({});

  res.json({
    message: "Posts fetched successfully!",
    posts: posts,
  });
});

app.get("/api/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.json(post);
});

app.post("/api/posts", async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  const addedPost = await post.save();
  res
    .status(201)
    .json({ message: "Post added successfully!", postId: addedPost._id });
});

app.put("/api/posts/:id", async (req, res, next) => {
  await Post.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      content: req.body.content,
    }
  );
  res.json({ message: "Update successfully!" });
});

app.delete("/api/posts/:id", async (req, res, next) => {
  await Post.deleteOne({ _id: req.params.id });
  res.json({ message: "Post deleted!" });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
