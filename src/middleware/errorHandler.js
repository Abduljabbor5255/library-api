const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.code === "23505") {
    return res.status(400).json({ error: "Bu ma'lumot allaqachon mavjud" });
  }
  if (err.code === "23503") {
    return res.status(400).json({ error: "Bog'liq ma'lumot topilmadi" });
  }
  if (err.code === "23502") {
    return res.status(400).json({ error: "Majburiy maydon to'ldirilmagan" });
  }
  if (err.name === "ZodError") {
    return res
      .status(400)
      .json({ error: "Validatsiya xatosi", details: err.issues });
  }

  res.status(500).json({ error: "Server error" });
};

module.exports = errorHandler;
