import express from 'express';
import { analyzeAndSave, getArticles } from '../controller/articleController.js';
const route = express.Router();
route.post('/summary', analyzeAndSave);
route.get('/articles/:userId', getArticles);
export default route;
