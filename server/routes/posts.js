const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if (isValid) {
      error = null;
    }

    cb(error, "./public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, uniqueSuffix + "." + ext);
  },
});

router.get("", async (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find({});

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  const posts = await postQuery;
  const totalPost = await Post.count();

  res.json({
    message: "Posts fetched successfully!",
    posts: posts,
    maxPost: totalPost,
  });
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.json(post);
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  async (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: "images/" + req.file.filename,
      createdBy: req.userData.userId,
    });

    await post.save();
    res.status(201).json({ message: "Post added successfully!" });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  async (req, res, next) => {
    let imagePath = req.body.image;

    if (req.file) {
      imagePath = "images/" + req.file.filename;
    }

    const result = await Post.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userData.userId },
      {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
      }
    );

    if (result) {
      return res.json({ message: "Update successfully!" });
    } else {
      return res.status(401).json({ message: "Not authorized!" });
    }
  }
);

router.delete("/:id", checkAuth, async (req, res, next) => {
  const result = await Post.deleteOne({
    _id: req.params.id,
    createdBy: req.userData.userId,
  });

  if (result.deletedCount) {
    return res.json({ message: "Post deleted!" });
  } else {
    return res.status(401).json({ message: "Not authorized!" });
  }
});

module.exports = router;
