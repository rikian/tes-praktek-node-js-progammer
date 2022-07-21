const request = require("supertest");
const { app } = require("../app/server");

test("test get index tanpa login", async () => {
  const res = await request(app).get("/");
  const result = res.statusCode
  
  expect(result).toBe(404);
});

test("test get products tanpa login", async () => {
  const res = await request(app).get("/products/");
  const result = res.statusCode
  
  expect(result).toBe(404);
});