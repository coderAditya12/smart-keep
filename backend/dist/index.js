import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./utilis/db.js";
import aiRoute from "./route/ArticleRoute.js";
import userRoute from "./route/userRoute.js";
import cors from "cors";
const app = express();
const port = 3000;
app.use(cors({
    origin: "*",
    methods: "*",
}));
app.use(express.json());
app.use("/api", aiRoute);
app.use("/api", userRoute);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(port, () => {
    connectDB();
    console.log("Starting server...");
    console.log(`Server is running at http://localhost:${port}`);
});
