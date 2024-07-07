import { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import { csvQueue } from "../utils/queue";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Multer file filter to check file type
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["text/csv"]; // Can be updated with more file types
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

const uploadCSV = (req: Request, res: Response) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const csvJob = await csvQueue.add({
        file: { path: req.file.path, name: req.file.filename },
        userId: req.user,
      });

      res.status(202).json({
        message: `File received and processing started with jobID: ${csvJob.id}`,
      });
    } catch (err) {
      res.status(500).json({
        message: `Internal server failed. Unable to create queue`,
      });
    }
  });
};

export default uploadCSV;
