const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const db = require("../auth/user-model");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const server = express();
const verifyCookie = require("../auth/authorizeSession");

const dbConnection = require("../data/connection");
const sessionConfiguration = {
  name: "UserSession", // default value is sid
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe", //key for encryption
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.USE_SECURE_COOKIES || false,
    httpOnly: true, //prevent JS code on client from accessing this cookie
  },
  resave: false,
  saveUnitialized: true, // read docs, it's related to GDPR compliance
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createTable: true,
    clearInterval: 1000 * 60 * 30, // time to check and remove expired sessions from database
  }),
};

server.use(session(sessionConfiguration));

server.use(helmet());
server.use(express.json());
server.use(cors());

const authRouter = require("../auth/authRouter");
server.use("/api/auth", authRouter);

server.get("/api", (req, res) => {
  res.status(200).json({ api: "Up and Running Great!" });
});

server.get("/api/users", verifyCookie, async (req, res) => {
  const users = await db.find();
  if (!users) {
    handleError("USERS NOT FOUND", res);
  }

  res.status(200).json({ data: users });
});

server.get("/api/users/:id", verifyCookie, (req, res) => {
  db.findBy(req.params.id)
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((err) => {
      handleError(err, res);
    });
});

function handleError(err, res) {
  res.status(500).json({ error: err, message: "SERVER ERROR" });
}

module.exports = server;
