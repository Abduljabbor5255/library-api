const pool = require("../db/database");

const borrowBook = async (req, res, next) => {
  const { book_id } = req.body;
  const user_id = req.user.id; 

  const client = await pool.connect(); 

  try {
    await client.query("BEGIN"); 

    const bookResult = await client.query(
      "SELECT * FROM books WHERE id = $1 FOR UPDATE",
      [book_id]
    );

    const book = bookResult.rows[0];

    if (!book) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Kitob topilmadi" });
    }

    if (book.copies_count <= 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Kitobning bo'sh nusxasi yo'q" });
    }

    const existingLoan = await client.query(
      "SELECT * FROM loans WHERE user_id=$1 AND book_id=$2 AND returned_at IS NULL",
      [user_id, book_id]
    );
    if (existingLoan.rows[0]) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Siz bu kitobni allaqachon olgansiz" });
    }

    await client.query(
      "UPDATE books SET copies_count = copies_count - 1 WHERE id = $1",
      [book_id]
    );

    const loanResult = await client.query(
      "INSERT INTO loans (user_id, book_id) VALUES ($1, $2) RETURNING *",
      [user_id, book_id]
    );

    await client.query("COMMIT"); 

    res.status(201).json({
      message: "Kitob muvaffaqiyatli olindi!",
      loan: loanResult.rows[0]
    });

  } catch (err) {
    await client.query("ROLLBACK"); 
    next(err);
  } finally {
    client.release(); 
  }
};

const returnBook = async (req, res, next) => {
  const user_id = req.user.id;
  const loan_id = req.params.id;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const loanResult = await client.query(
      "SELECT * FROM loans WHERE id=$1 AND returned_at IS NULL",
      [loan_id]
    );
    const loan = loanResult.rows[0];

    if (!loan) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Ijara topilmadi yoki allaqachon qaytarilgan" });
    }

    if (loan.user_id !== user_id) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Bu sizning ijarangiz emas" });
    }

    await client.query(
      "UPDATE loans SET returned_at = NOW() WHERE id = $1",
      [loan_id]
    );

    await client.query(
      "UPDATE books SET copies_count = copies_count + 1 WHERE id = $1",
      [loan.book_id]
    );

    await client.query("COMMIT");

    res.json({ message: "Kitob muvaffaqiyatli qaytarildi!" });

  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

const getMyLoans = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT loans.*, books.title as book_title
       FROM loans
       LEFT JOIN books ON loans.book_id = books.id
       WHERE loans.user_id = $1
       ORDER BY loans.borrowed_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { borrowBook, returnBook, getMyLoans };