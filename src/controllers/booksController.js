const pool = require("../db/database");

const getAllBooks = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const safePage = Math.max(1, parseInt(page));
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (safePage - 1) * safeLimit;

    let query = `
      SELECT books.*, authors.name as author_name 
      FROM books 
      LEFT JOIN authors ON books.author_id = authors.id
    `;
    const params = [];

    if (search) {
      query += " WHERE books.title ILIKE $1";
      params.push(`%${search}%`);
    }

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(safeLimit, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT books.*, authors.name as author_name 
       FROM books 
       LEFT JOIN authors ON books.author_id = authors.id 
       WHERE books.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Kitob topilmadi" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { title, author_id, published_year } = req.body;
    const result = await pool.query(
      "INSERT INTO books (title, author_id, published_year) VALUES ($1, $2, $3) RETURNING *",
      [title, author_id, published_year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const existing = await pool.query("SELECT * FROM books WHERE id=$1", [req.params.id]);
    if (!existing.rows[0]) return res.status(404).json({ error: "Kitob topilmadi" });

    const old = existing.rows[0];
    const title = req.body.title ?? old.title;
    const author_id = req.body.author_id ?? old.author_id;
    const published_year = req.body.published_year ?? old.published_year;

    const result = await pool.query(
      "UPDATE books SET title=$1, author_id=$2, published_year=$3 WHERE id=$4 RETURNING *",
      [title, author_id, published_year, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM books WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Kitob topilmadi" });
    res.json({ message: "Kitob o'chirildi" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };