require("dotenv").config();
import express, { Application, json } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import csvRoutes from "./routes/csvRoutes";
import fileRoutes from "./routes/fileRoutes";
import { connectDB } from "./utils/database";
import { initializeQueue } from "./utils/queue";

const app: Application = express();

app.use(cors());
app.use(json());

app.use("/api/user", userRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/file", fileRoutes)

connectDB();
initializeQueue();

export default app;
