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

app.post("/api/posts", async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  await post.save();
  res.status(201).json({ message: "Post added successfully!" });
});

app.delete("/api/posts/:id", async (req, res, next) => {
  await Post.deleteOne({ _id: req.params.id });
  res.json({ message: "Post deleted!" });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
