import app from "./app";

import { Request, Response, NextFunction } from "express";

const PORT = process.env.PORT || 3000;

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log(`Server is running on port ${PORT}. URL: ${url}`);
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
