import express from "express";
import { welcomeUser } from "../controller/userController.js";
const route = express.Router();

route.post('/auth',welcomeUser);
export default route;