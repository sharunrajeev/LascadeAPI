import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "./authMiddleware"; // Adjust the import path

// Mock JWT module
jest.mock("jsonwebtoken");
const jwtMock = jwt as jest.Mocked<typeof jwt>;

// Mock Express objects
const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as any;
const mockNext = jest.fn() as NextFunction;

describe("Auth Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token provided", () => {
    authMiddleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    mockRequest.headers = { authorization: "Bearer invalidtoken" };
    jwtMock.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
