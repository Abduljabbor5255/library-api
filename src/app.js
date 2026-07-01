const express = require("express");
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

app.use("/auth",    require("./routes/authRoutes"));
app.use("/books",   require("./routes/booksRoutes"));
app.use("/authors", require("./routes/authorsRoutes"));
app.use("/loans",   require("./routes/loansRoutes"));

app.get("/", (req, res) => res.send("Library API"));

app.use(errorHandler);

module.exports = app;