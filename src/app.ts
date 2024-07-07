require("dotenv").config();
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");
import express, { Application, json } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import csvRoutes from "./routes/csvRoutes";
import { connectDB } from "./utils/database";
import csvQueue from "./utils/queue";

const app: Application = express();

const serverAdapter = new ExpressAdapter();
const csvQueueBullAdapter = new BullAdapter(csvQueue);
serverAdapter.setBasePath("/api/queue");
createBullBoard({
  queues: [csvQueueBullAdapter],
  serverAdapter: serverAdapter,
});

app.use(cors());
app.use(json());

app.use("/api/user", userRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/queue", serverAdapter.getRouter());

connectDB();

export default app;
