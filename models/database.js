const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "../database/menu.db"),
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Database connected");
    }
  }
);

module.exports = db;