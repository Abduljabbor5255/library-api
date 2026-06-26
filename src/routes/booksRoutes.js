const router = require("express").Router();
const auth = require("../middleware/auth");
const { getAllBooks, getBookById, createBook, updateBook, deleteBook } = require("../controllers/booksController");

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", auth, createBook);
router.put("/:id", auth, updateBook);
router.delete("/:id", auth, deleteBook);

module.exports = router;