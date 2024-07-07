import express, { Request, Response } from "express";
import FileStatus, { IFileStatus } from "../models/FileStatus";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/status", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user as string; 
    
    const fileStatuses: IFileStatus[] = await FileStatus.find({
      userId,
    }).exec();

    return res.json(fileStatuses);
  } catch (error) {
    console.error("Error retrieving file statuses:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Unable to fetch file status." });
  }
});

export default router;
