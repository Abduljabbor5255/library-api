const pool = require("../db/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Parol noto'g'ri" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };