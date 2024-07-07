import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import csvProcessor from "../workers/csvProcessor"; // Assuming csvProcessor is your module to process CSV files

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
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

// Initialize Multer with the storage and file filter
const upload = multer({ storage, fileFilter });

// CSV upload handler
export const uploadCSV = (req: Request, res: Response) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File uploaded successfully:", req.file);
    // Process the CSV file
    req.file.path
      ? csvProcessor(req.file.path)
          .then(() => {
            res
              .status(200)
              .json({ message: "CSV file processed successfully" });
          })
          .catch((processError) => {
            res
              .status(500)
              .json({
                message: "Error processing CSV file",
                error: processError.message,
              });
          })
      : res.status(400).json({ message: "Unable to fetch file path" });
  });
};
