const express = require("express");
require("dotenv").config();
const pool = require("./src/db/database");
const errorHandler = require("./src/middleware/errorHandler");


const app = express();
app.use(express.json());

app.use("/auth", require("./src/routes/authRoutes"));
app.use("/books", require("./src/routes/booksRoutes"));
app.use("/authors", require("./src/routes/authorsRoutes"));
app.use(errorHandler);


app.get("/", (req, res) => res.send("Library API"));

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.log("Database connection failed", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
