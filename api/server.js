const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/api", (req, res) => {
  res.status(200).json({ api: "Up and Running Great!" });
});

server.get("/api/users", (req, res) => {
  res.status(200).json({ users: [] });
});

module.exports = server;
