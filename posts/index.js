const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const axios = require("axios");
app.use(bodyParser.json());
const port = 4000;
app.use(cors());
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  try {
    await axios.post("http://localhost:4005/events", {
      type: "PostCreated",
      data: {
        id,
        title,
      },
    });
  } catch (error) {
    console.log(error);
  }

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("receive event", req.body.type);
  res.send({});
});

app.listen(port, () => {
  console.log("Listening on 4000");
});
