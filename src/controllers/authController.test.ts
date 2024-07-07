import request from "supertest";
import express, { Application, Request, Response } from "express";
import { register, login } from "./authController"; // Adjust the import path
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock User model
jest.mock("../models/User");
const UserMock = User as jest.Mocked<typeof User>;

// Mock bcrypt and jwt
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const app: Application = express();
app.use(express.json());
app.post("/register", register);
app.post("/login", login);

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 if email or password is missing", async () => {
      const res = await request(app).post("/register").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email and password are required");
    });

    it("should return 201 if user is created successfully", async () => {
      const hashedPassword = "hashedPassword";
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      UserMock.prototype.save.mockResolvedValue({});

      const res = await request(app)
        .post("/register")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created");
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(UserMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: hashedPassword,
      });
    });

    it("should return 500 if there is an error creating user", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      UserMock.prototype.save.mockRejectedValue(new Error("Error"));

      const res = await request(app)
        .post("/register")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error creating user");
      expect(res.body.error).toBeDefined();
    });
  });

  describe("login", () => {
    it("should return 400 if email or password is missing", async () => {
      const res = await request(app).post("/login").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email and password are required");
    });

    it("should return 401 if invalid credentials", async () => {
      UserMock.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should return 200 if login is successful", async () => {
      const user = {
        _id: "123",
        email: "test@example.com",
        password: "hashedPassword",
      };
      UserMock.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      const res = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe("token");
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user._id },
        expect.any(String),
        { expiresIn: "1h" }
      );
    });

    it("should return 500 if there is an error logging in", async () => {
      UserMock.findOne.mockRejectedValue(new Error("Error"));

      const res = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error logging in");
      expect(res.body.error).toBeDefined();
    });
  });
});
