const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    password: hash,
  });

  const result = await user.save();

  res.status(201).json({
    message: "User created successfully",
    result: result,
  });
});

module.exports = router;
