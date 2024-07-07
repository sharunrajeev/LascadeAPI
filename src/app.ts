require("dotenv").config();
import express, { Application } from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user";
import csvRoutes from "./routes/csv";
import { sequelize } from "./models";

const app: Application = express();

app.use(bodyParser.json());

app.use("/api/user", userRoutes);
app.use("/api/csv", csvRoutes);

sequelize.sync().then(() => {
  console.log("Database connected");
});

export default app;
