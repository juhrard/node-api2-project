const express = require("express");

const post_router = require("./blog-router/post-router");

const server = express();

server.use(express.json()); // needed to parse JSON from the body

// for URLs beginning with /api
server.use("/api/posts", post_router);

server.get("/", (req, res) => {
  res.send(`
    <h2>Blog API</h2>
    <p>Welcome to the Blog API</p>
  `);
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
