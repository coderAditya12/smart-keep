import express from "express";
import dotenv from "dotenv";
import connectDB from "./utilis/db.js";
import aiRoute from "./route/ArticleRoute.js";
dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());
app.use("/api", aiRoute);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    connectDB();
    console.log("Starting server...");
    console.log(`Server is running at http://localhost:${port}`);
});
