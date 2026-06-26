const pool = require("../db/database");

const getAll = async (req, res) => {
  const result = await pool.query("SELECT * FROM authors");
  res.json(result.rows);
};

const getById = async (req, res) => {
  const result = await pool.query("SELECT * FROM authors WHERE id=$1", [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: "Muallif topilmadi" });
  res.json(result.rows[0]);
};

const create = async (req, res) => {
  const { name, bio } = req.body;
  const result = await pool.query("INSERT INTO authors (name, bio) VALUES ($1, $2) RETURNING *", [name, bio]);
  res.status(201).json(result.rows[0]);
};

const update = async (req, res) => {
  const { name, bio } = req.body;
  const result = await pool.query("UPDATE authors SET name=$1, bio=$2 WHERE id=$3 RETURNING *", [name, bio, req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: "Muallif topilmadi" });
  res.json(result.rows[0]);
};

const remove = async (req, res) => {
  const result = await pool.query("DELETE FROM authors WHERE id=$1 RETURNING *", [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: "Muallif topilmadi" });
  res.json({ message: "Muallif o'chirildi" });
};

module.exports = { getAll, getById, create, update, remove };