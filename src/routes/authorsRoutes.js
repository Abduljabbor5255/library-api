const router = require("express").Router();
const { authMiddleware, requireAdmin } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { authorSchema } = require("../middleware/schemas");
const {
  getAll, getById, create, update, remove
} = require("../controllers/authorsController");

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authMiddleware, requireAdmin, validate(authorSchema), create);
router.put("/:id", authMiddleware, requireAdmin, update);
router.delete("/:id", authMiddleware, requireAdmin, remove);

module.exports = router;