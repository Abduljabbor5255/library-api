const router = require("express").Router();
const { authMiddleware, requireAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { bookSchema } = require("../middleware/schemas");
const {
  getAllBooks, getBookById,
  createBook, updateBook, deleteBook
} = require("../controllers/booksController");

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", authMiddleware, requireAdmin, validate(bookSchema), createBook);
router.put("/:id", authMiddleware, requireAdmin, updateBook); 
router.delete("/:id", authMiddleware, requireAdmin, deleteBook);

module.exports = router;