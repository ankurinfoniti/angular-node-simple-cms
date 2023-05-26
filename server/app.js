const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 3000;

app.use(cors());

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

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
