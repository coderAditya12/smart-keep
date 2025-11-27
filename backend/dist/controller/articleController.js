import { GoogleGenAI } from "@google/genai";
import { Article } from "../models/Article.model.js";
const ai = new GoogleGenAI({});
export const analyzeAndSave = async (req, res) => {
    const { url, userId } = req.body;
    const existingArticle = await Article.findOne({ userId, originalUrl: url });
    if (existingArticle) {
        res.status(200).json(existingArticle);
        return;
    }
    //   axios to get the raw html
    //   const {data:html} = await axios.get(url,{
    // headers:{
    //     'User-Agent':
    // }
    //   })
};
