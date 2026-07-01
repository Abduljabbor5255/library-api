const pool = require("./database");
const bcrypt = require("bcryptjs");

const seed = async () => {
  try {
    console.log("Seed boshlandi...");

    const hashedPassword = await bcrypt.hash("123456", 10);
    await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ["Admin", "admin@library.com", hashedPassword, "admin"]
    );
    console.log("Admin user yaratildi (admin@library.com / 123456)");

    await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ["Test User", "user@library.com", hashedPassword, "user"]
    );
    console.log("Oddiy user yaratildi (user@library.com / 123456)");

    const authorsResult = await pool.query(
      `INSERT INTO authors (name, bio) VALUES 
       ('James Clear', 'Amerikalik yozuvchi, Atomic Habits muallifi'),
       ('Abdulla Qodiriy', 'O''zbek adabiyotining asoschilaridan biri'),
       ('Jordan Peterson', 'Kanadalik psixolog va yozuvchi')
       RETURNING id, name`
    );
    console.log(`${authorsResult.rows.length} ta muallif qo'shildi`);

    const [author1, author2, author3] = authorsResult.rows;
    await pool.query(
      `INSERT INTO books (title, author_id, published_year) VALUES 
       ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)`,
      [
        "Atomic Habits", author1.id, 2018,
        "O'tkan Kunlar", author2.id, 1925,
        "12 Rules for Life", author3.id, 2018
      ]
    );
    console.log("3 ta kitob qo'shildi");

    console.log("Seed yakunlandi!");
    process.exit(0);
  } catch (err) {
    console.error("Seed xatosi:", err);
    process.exit(1);
  }
};

seed();