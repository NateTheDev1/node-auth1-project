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
