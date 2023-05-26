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

app.get("/api/posts", (req, res) => {
  const posts = [
    {
      id: "ajflkdjglfkjfs",
      title: "First One",
      content: "This is first one",
    },
    {
      id: "aalkjrfn",
      title: "Second One",
      content: "This is second one",
    },
  ];

  res.json({
    message: "Posts fetched successfully!",
    posts: posts,
  });
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  res.status(201).json({ message: "Post added successfully" });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
