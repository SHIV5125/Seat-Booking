const pool = require("../db");
const { hashPassword, comparePassword, generateToken } = require("../utils/auth");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashed]
    );
    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: "Email already exists or invalid data" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) return res.status(400).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
