require("dotenv").config();
const app = require("./src/app");
const pool = require("./src/db/database");

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.log("Database connection failed", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));