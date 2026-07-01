const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { register, login } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../middleware/schemas");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Juda ko'p urinish, aniqrog'i 5 marta urundingiz, 15 daqiqadan keyin qaytadan urining" }
});

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);

module.exports = router;