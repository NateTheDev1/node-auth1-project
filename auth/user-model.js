const db = require("../data/connection");

function find() {
  return db.select("id", "username").from("users");
}

function findBy(id) {
  return db("users").where({ id }).first();
}

function findUser(username) {
  return db("users").where({ username }).first();
}

function create(user) {
  return db("users").insert(user);
}

module.exports = { find, create, findBy, findUser };
