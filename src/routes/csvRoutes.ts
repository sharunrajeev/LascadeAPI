import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import uploadCSV from "../controllers/csvController";

const router = Router();

router.post("/upload", authMiddleware, uploadCSV);

export default router;
