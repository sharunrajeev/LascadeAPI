import { Router } from "express";
import { uploadCSV } from "../controllers/csvController";
import auth from "../middlewares/auth";

const router = Router();

router.post("/upload", auth, uploadCSV);

export default router;
