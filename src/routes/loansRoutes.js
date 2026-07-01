const router = require("express").Router();
const { authMiddleware } = require("../middleware/auth");
const { borrowBook, returnBook, getMyLoans } = require("../controllers/loansController");

router.post("/", authMiddleware, borrowBook);           
router.post("/:id/return", authMiddleware, returnBook); 
router.get("/my", authMiddleware, getMyLoans);         

module.exports = router;