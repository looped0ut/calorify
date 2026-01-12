const path = require("path");

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("database.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS user_profile (
    user_id INTEGER,
    height TEXT,
    weight TEXT,
    goal TEXT
  )
`);

app.use(express.static(path.join(__dirname, "public")));

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  db.run(query, [name, email, password], function (err) {
    if (err) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.json({ message: "Signup successful" });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ user });
  });
});

app.post("/profile", (req, res) => {
  const { user_id, height, weight, goal } = req.body;

  const query = `
    INSERT OR REPLACE INTO user_profile (user_id, height, weight, goal)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [user_id, height, weight, goal], err => {
    if (err) {
      return res.status(500).json({ message: "Profile save failed" });
    }
    res.json({ message: "Profile saved" });
  });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
