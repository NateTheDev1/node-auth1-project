const db = require("../data/connection");

function find() {
  return db.select("id", "username").from("users");
}

module.exports = { find };
