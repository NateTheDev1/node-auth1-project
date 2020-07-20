const router = require("express").Router();
const db = require("../auth/user-model");
const bcrypt = require("bcryptjs");

router.post("/register", validateBody, (req, res) => {
  const rounds = process.env.HASH_ROUNDS || 4;
  const salt = bcrypt.genSaltSync(rounds);
  const hash = bcrypt.hashSync(req.password, salt);
  db.create({ username: req.username, password: hash })
    .then((saved) => {
      return res.status(201).json({ data: saved });
    })
    .catch((err) => {
      handleError(err, res, "COULD NOT SAVE USER");
    });
});

router.post("/login", validateBody, (req, res) => {
  db.findUser(req.username)
    .then((user) => {
      if (user && bcrypt.compareSync(req.password, user.password)) {
        req.session.loggedIn = true;
        req.session.username = user.username;
        req.session.uid = user.id;
        res
          .status(200)
          .json({ message: "You have been logged in.", session: req.session });
      } else {
        res.status(401).json({ error: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      handleError(err, res);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        handleError(err, res, "COULD NOT LOGOUT USER");
      } else {
        res.status(204).end();
      }
    });
  } else {
    res.status(200).json({ message: "Already Logged Out" });
  }
});

function validateBody(req, res, next) {
  if (req.body.username === undefined || req.body.password === undefined) {
    handleError("ERROR", res, "Required: Username And Password");
  } else {
    req.username = req.body.username;
    req.password = req.body.password;
    next();
  }
}

function handleError(err, res, message = "SERVER ERROR") {
  res.status(500).json({ error: err, message });
}

module.exports = router;
