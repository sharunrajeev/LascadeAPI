import { Request, Response } from "express";
import multer from "multer";
import { csvQueue } from "../utils/queue";

const upload = multer({ dest: "uploads/" });

const uploadCSV = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required" });
  }

  csvQueue.add({
    file: { path: req.file.path, name: req.file.filename },
    userId: req.user,
  });

  res.status(202).json({ message: "File received and processing started" });
};

export { upload, uploadCSV };
