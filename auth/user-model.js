const db = require("../data/connection");

function find() {
  return db.select("id", "username").from("users");
}

function findBy(query) {
  return db("users").where({ query }).first();
}

function create(user) {
  return db("users").insert(user);
}

module.exports = { find, create };
