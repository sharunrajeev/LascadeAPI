import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { upload, uploadCSV } from "../controllers/csvController";

const router = Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadCSV);

export default router;
