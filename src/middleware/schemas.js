const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Ism kamida 2 ta harf bo'lishi kerak")
    .max(100, "Ism 100 ta harfdan oshmasin"),

  email: z.string().email("Email noto'g'ri formatda"),

  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
});

const loginSchema = z.object({
  email: z.string().email("Email noto'g'ri formatda"),

  password: z.string().min(1, "Parol bo'sh bo'lmasin"),
});

const bookSchema = z.object({
  title: z
    .string()
    .min(1, "Kitob nomi bo'sh bo'lmasin")
    .max(255, "Kitob nomi 255 ta harfdan oshmasin"),

  author_id: z
    .number()
    .int("author_id butun son bo'lishi kerak")
    .positive("author_id musbat bo'lishi kerak"),

  published_year: z
    .number()
    .int("Yil butun son bo'lishi kerak")
    .min(1000, "Yil 1000 dan katta bo'lsin")
    .max(new Date().getFullYear(), "Yil kelajakda bo'lishi mumkin emas")
    .optional(),
});

const authorSchema = z.object({
  name: z
    .string()
    .min(2, "Muallif ismi kamida 2 ta harf")
    .max(255, "Muallif ismi 255 ta harfdan oshmasin"),

  bio: z.string().max(1000, "Bio 1000 ta harfdan oshmasin").optional(),
});

module.exports = { registerSchema, loginSchema, bookSchema, authorSchema };
