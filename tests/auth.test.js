const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db/database");

afterAll(async () => {
  await pool.query("DELETE FROM loans");
  await pool.query("DELETE FROM users WHERE email LIKE '%test%'");
  await pool.end();
});

describe("AUTH — Register", () => {
  test("To'g'ri ma'lumot bilan register", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test123@gmail.com",
        password: "123456"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("test123@gmail.com");
    expect(res.body.password).toBeUndefined(); 
  });

  test("Noto'g'ri email bilan register", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test",
        email: "nototgri-email",
        password: "123456"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Validatsiya xatosi");
  });

  test("Qisqa parol bilan register", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test",
        email: "test@gmail.com",
        password: "123"
      });
    expect(res.statusCode).toBe(400);
  });

  test("Takror email bilan register", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Test",
        email: "test123@gmail.com", 
        password: "123456"
      });
    expect(res.statusCode).toBe(400);
  });
});

describe("AUTH — Login", () => {
  test("To'g'ri ma'lumot bilan login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "test123@gmail.com",
        password: "123456"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined(); 
  });

  test("Noto'g'ri parol bilan login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "test123@gmail.com",
        password: "notogri"
      });
    expect(res.statusCode).toBe(401);
  });

  test("Mavjud bo'lmagan email bilan login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "yoq@gmail.com",
        password: "123456"
      });
    expect(res.statusCode).toBe(404);
  });
});