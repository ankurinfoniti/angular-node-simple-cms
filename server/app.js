const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();
const port = process.env.port || 3000;

mongoose.connect("mongodb://localhost:27017/simple-cms");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));

app.use("/api/posts", postsRoutes);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
