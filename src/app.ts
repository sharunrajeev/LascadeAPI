require("dotenv").config();
import express, { Application, json } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import csvRoutes from "./routes/csvRoutes";
import { connectDB } from "./utils/database";

const app: Application = express();

app.use(cors());
app.use(json());

app.use("/api/user", userRoutes);
app.use("/api/csv", csvRoutes);

connectDB();

export default app;
