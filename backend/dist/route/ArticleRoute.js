import express from 'express';
import { analyzeAndSave } from '../controller/articleController.js';
const route = express.Router();
route.post('/summary', analyzeAndSave);
export default route;
