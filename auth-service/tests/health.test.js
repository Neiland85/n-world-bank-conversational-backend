const request = require("supertest");
const express = require("express");
// Simulamos el servidor Express
const app = express();
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "auth-service" });
});
describe("GET /health", () => {
  it("should return service status", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "OK", service: "auth-service" });
  });
});
