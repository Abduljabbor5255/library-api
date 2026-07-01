const pool = require("./database");

const migrate = async () => {
  try {
    console.log("Migratsiya boshlandi...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("users jadvali tayyor");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("authors jadvali tayyor");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author_id INT REFERENCES authors(id) ON DELETE SET NULL,
        published_year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("books jadvali tayyor");

    console.log("Migratsiya yakunlandi!");
    process.exit(0);
  } catch (err) {
    console.error("Migratsiya xatosi:", err);
    process.exit(1);
  }
};

migrate();