const express = require("express");
const { randomBytes } = require("crypto");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 4001;

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;

  try {
    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
      },
    });
  } catch (error) {
    console.log(error);
  }
  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("receive event", req.body.type);
  res.send({});
});

app.listen(port, () => {
  console.log("Listening on 4001");
});
