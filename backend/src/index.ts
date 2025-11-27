import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./utilis/db.js";
import aiRoute from "./route/ArticleRoute.js";
import axios from "axios";
dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());
app.use("/api", aiRoute);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  connectDB();
  console.log("Starting server...");
  console.log(`Server is running at http://localhost:${port}`);
});
