const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const db = require("../auth/user-model");
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/api", (req, res) => {
  res.status(200).json({ api: "Up and Running Great!" });
});

server.get("/api/users", async (req, res) => {
  const users = await db.find();
  if (!users) {
    handleError(err, res);
  }

  res.status(200).json({ data: users });
});

function handleError(err, res) {
  res.status(500).json({ error: err, message: "SERVER ERROR" });
}

module.exports = server;
