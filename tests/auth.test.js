import { jest } from "@jest/globals";
import "dotenv/config";
import request from "supertest";
import mongoose from "mongoose";
import crypto from "crypto";

jest.unstable_mockModule("../utils/email.js", () => ({
  default: jest.fn(),
}));

const { default: app } = await import("../app.js");
const { default: User } = await import("../models/User.js");

const DB_URI = process.env.DB_URI.replace(
  "AuthenticationJWT",
  "AuthenticationJWT_TEST"
);

beforeAll(async () => await mongoose.connect(DB_URI));
afterAll(async () => await mongoose.connection.close());

beforeEach(async () => await User.deleteMany({}));

describe("Auth Endpoints", () => {
  let authCookie;

  describe("POST /api/v1/auth/signup", () => {
    it("should create a new user and return a token", async () => {
      const res = await request(app).post("/api/v1/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual("success");
      expect(res.body.data.user).toHaveProperty("email", "test@example.com");
      expect(res.body.data.user).not.toHaveProperty("password");
    });

    it("should return 400 if passwords do not match", async () => {
      const res = await request(app).post("/api/v1/auth/signup").send({
        name: "Test User",
        email: "fail@example.com",
        password: "password123",
        passwordConfirm: "WRONG_PASSWORD",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/valid|match/i);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/v1/auth/signup").send({
        name: "Login User",
        email: "login@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });

      await User.updateOne(
        { email: "login@example.com" },
        { isVerified: true }
      );
    });

    it("should login user and return a cookie", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual("success");

      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/jwt=/);
      expect(cookies[0]).toMatch(/HttpOnly/);

      authCookie = cookies;
    });

    it("should reject incorrect password", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "login@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe("GET /api/v1/auth/me (Protected Route)", () => {
    beforeEach(async () => {
      await request(app).post("/api/v1/auth/signup").send({
        name: "Me User",
        email: "me@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });

      await User.updateOne({ email: "me@example.com" }, { isVerified: true });

      const res = await request(app).post("/api/v1/auth/login").send({
        email: "me@example.com",
        password: "password123",
      });

      authCookie = res.headers["set-cookie"];
    });

    it("should allow access with valid cookie", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Cookie", authCookie);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.user).toHaveProperty("email", "me@example.com");
    });

    it("should block access without cookie", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toMatch(/logged in/i);
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should clear the cookie", async () => {
      const res = await request(app).post("/api/v1/auth/logout");
      expect(res.statusCode).toEqual(200);

      const cookies = res.headers["set-cookie"];
      expect(cookies[0]).toMatch(/jwt=loggedout/);
    });
  });
});

describe("Password Reset Flow", () => {
  let userEmail = "reset@example.com";

  beforeEach(async () => {
    const signupRes = await request(app).post("/api/v1/auth/signup").send({
      name: "Reset User",
      email: userEmail,
      password: "password123",
      passwordConfirm: "password123",
    });

    if (signupRes.statusCode !== 201)
      console.error("Test Setup Failed:", signupRes.body);

    await User.updateOne({ email: userEmail }, { isVerified: true });
  });

  describe("POST /api/v1/auth/forgotPassword", () => {
    it("should send an email with reset token", async () => {
      const res = await request(app).post("/api/v1/auth/forgotPassword").send({
        email: userEmail,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toMatch(/token sent to email/i);
    });

    it("should fail if email does not exist", async () => {
      const res = await request(app).post("/api/v1/auth/forgotPassword").send({
        email: "unknown@example.com",
      });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe("PATCH /api/v1/auth/resetPassword/:token", () => {
    it("should reset password with valid token", async () => {
      const resetToken = "my-super-secret-reset-token";
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const user = await User.findOne({ email: userEmail });

      user.passwordResetToken = hashedToken;
      user.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000; // +10 min

      await user.save({ validateBeforeSave: false });

      const res = await request(app)
        .patch(`/api/v1/auth/resetPassword/${resetToken}`)
        .send({
          password: "newpassword456",
          passwordConfirm: "newpassword456",
        });

      if (res.statusCode !== 200) console.log("Reset Failed Body:", res.body);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual("success");
      expect(res.headers["set-cookie"]).toBeDefined();

      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: userEmail,
        password: "newpassword456",
      });
      expect(loginRes.statusCode).toEqual(200);
    });

    it("should reject expired or invalid token", async () => {
      const invalidToken = "invalid-token-123";
      const res = await request(app)
        .patch(`/api/v1/auth/resetPassword/${invalidToken}`)
        .send({
          password: "newpassword456",
          passwordConfirm: "newpassword456",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/token is invalid/i);
    });
  });
});
