const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("database.db");

/* ---------------- TABLES ---------------- */

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
    user_id INTEGER PRIMARY KEY,
    age INTEGER,
    gender TEXT,
    height INTEGER,
    weight INTEGER,
    activity_level TEXT,
    dietary_goal TEXT,
    lifestyle TEXT,
    diet_preference TEXT,
    health_background TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

/* ---------------- STATIC FILES ---------------- */

app.use(express.static(path.join(__dirname, "public")));

/* ---------------- SIGNUP ---------------- */

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    function (err) {
      if (err) {
        return res.status(400).json({ message: "User already exists" });
      }

      // IMPORTANT: return userId
      res.json({
        success: true,
        userId: this.lastID
      });
    }
  );
});

/* ---------------- LOGIN ---------------- */

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT id FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err || !row) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // IMPORTANT: return userId
      res.json({
        success: true,
        userId: row.id
      });
    }
  );
});

/* ---------------- SAVE / UPDATE PROFILE ---------------- */

app.post("/profile", (req, res) => {
  const {
    userId,
    age,
    gender,
    height,
    weight,
    activityLevel,
    dietaryGoal,
    lifestyle,
    dietPreference,
    healthBackground
  } = req.body;

  db.run(
    `
    INSERT OR REPLACE INTO user_profile
    (user_id, age, gender, height, weight, activity_level, dietary_goal, lifestyle, diet_preference, health_background)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      age,
      gender,
      height,
      weight,
      activityLevel,
      dietaryGoal,
      lifestyle,
      dietPreference,
      healthBackground
    ],
    err => {
      if (err) {
        return res.status(500).json({ message: "Profile save failed" });
      }
      res.json({ success: true });
    }
  );
});

/* ---------------- DASHBOARD FETCH ---------------- */

app.get("/dashboard/:userId", (req, res) => {
  const userId = req.params.userId;

  db.get(
    "SELECT * FROM user_profile WHERE user_id = ?",
    [userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(row);
    }
  );
});

/* ---------------- SERVER ---------------- */

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
