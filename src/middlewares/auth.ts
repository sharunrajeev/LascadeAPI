import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SA4wY5Od95nW7JDdWg4fleTOVFakkYJp";

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Please authenticate." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    console.log('Authorised');
    next();
  } catch (err) {
    res.status(401).json({ error: "Please authenticate." });
  }
};

export default auth;
