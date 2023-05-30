const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    password: hash,
  });

  try {
    const result = await user.save();

    res.status(201).json({
      message: "User created successfully",
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({
      message: "User does not exists",
    });
  }

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) {
    return res.status(401).json({
      message: "Password did not match.",
    });
  }

  const token = jwt.sign({ email: user.email, userId: user._id }, "secret", {
    expiresIn: "1h",
  });

  res.json({
    token: token,
    expiresIn: 3600,
    userId: user._id,
  });
});

module.exports = router;
