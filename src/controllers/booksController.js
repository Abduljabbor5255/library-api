const pool = require("../db/database");

const getAllBooks = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let query = "SELECT books.*, authors.name as author_name FROM books LEFT JOIN authors ON books.author_id = authors.id";
    const params = [];
    if (search) {
      query += " WHERE books.title ILIKE $1";
      params.push(`%${search}%`);
    }
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT books.*, authors.name as author_name FROM books LEFT JOIN authors ON books.author_id = authors.id WHERE books.id = $1",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Kitob topilmadi" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

const createBook = async (req, res) => {
  const { title, author_id, published_year } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO books (title, author_id, published_year) VALUES ($1, $2, $3) RETURNING *",
      [title, author_id, published_year]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

const updateBook = async (req, res) => {
  const { title, author_id, published_year } = req.body;
  try {
    const result = await pool.query(
      "UPDATE books SET title=$1, author_id=$2, published_year=$3 WHERE id=$4 RETURNING *",
      [title, author_id, published_year, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Kitob topilmadi" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM books WHERE id=$1 RETURNING *", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Kitob topilmadi" });
    res.json({ message: "Kitob o'chirildi" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };