// import * as cheerio from "cheerio";

// import { Request, Response } from "express";
// import { Article } from "../models/Article.model.js";
// import axios from "axios";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export const analyzeAndSave = async (req: Request, res: Response) => {
//   const { url, userId } = req.body;
//   const existingArticle = await Article.findOne({ userId, originalUrl: url });
//   if (existingArticle) {
//     res.status(200).json(existingArticle);
//     return;
//   }
//   try {
//     const { data: html } = await axios.get(url, {
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
//       }, // Fake a browser so websites don't block us
//     });
//     console.log("data", html);
//     const $ = cheerio.load(html);
//     console.log("cheerio response", $);
//     $("script,style,nav,footer,iframe,.ad,.advertisement").remove();
//     const rawText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 5000);
//     const metaTitle = $("title").text().trim() || "Untitled Article";
//     const prompt = `
//       Analyze the following text from a webpage.
//       Return a VALID JSON object with exactly these keys:
//       - "summary": A short paragraph summarizing the content (max 3 sentences).
//       - "tags": An array of 3-5 short category tags (strings).
//       - "title": A clean, descriptive title for the content.
      
//       Do NOT wrap the output in markdown code blocks. Just return the raw JSON string.
      
//       Text to analyze:
//       "${rawText}"
//     `;
//     const aiResponse = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });
//     console.log("ai response", aiResponse);
//     const text = aiResponse.text;

//     if (!text) {
//       res.status(400).json({ error: "Failed to generate content" });
//       return;
//     }
//     const cleanJson = text.replace(/```json|```/g, "").trim();
//     const aiData = JSON.parse(cleanJson);

//     // save to database
//     const newArticle = await Article.create({
//       userId,
//       originalUrl: url,
//       title: aiData.title || metaTitle,
//       aiSummary: aiData.summary,
//       tags: aiData.tags,
//       isRead: false,
//     });
//     res.status(201).json(newArticle);
//   } catch (error: any) {
//     console.error("Analysis Failed:", error);
//     res.status(500).json({
//       message: "Failed to process article",
//       error: error.message,
//     });
//   }
// };
import { Request, Response } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Article } from "../models/Article.model.js";

export const analyzeAndSave = async (req: Request, res: Response) => {
  try {
    const { url, userId } = req.body; // In a real app, userId comes from the auth token
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from environment variables");
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // 1. Check if we already have this URL for this user (Prevent duplicates)
    const existingArticle = await Article.findOne({ userId, originalUrl: url });
    if (existingArticle) {
      return res.status(200).json(existingArticle); // Return existing one instead of reprocessing
    }

    // 2. Scrape the Web Page (The "Eyes" of your app)
    // We use Axios to get the raw HTML
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      }, // Fake a browser so websites don't block us
    });

    // 3. Clean the Content (The "Filter")
    // Cheerio lets us use jQuery syntax on the server
    const $ = cheerio.load(html);

    // Remove scripts, styles, and ads to save token costs
    $("script, style, nav, footer, iframe, .ad, .advertisement").remove();

    // Get the main text content (limit to ~5000 chars to avoid token limits)
    const rawText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 5000);
    const metaTitle = $("title").text().trim() || "Untitled Article";

    // 4. AI Processing (The "Brain")
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze the following text from a webpage.
      Return a VALID JSON object with exactly these keys:
      - "summary": A short paragraph summarizing the content (max 3 sentences).
      - "tags": An array of 3-5 short category tags (strings).
      - "title": A clean, descriptive title for the content.
      
      Do NOT wrap the output in markdown code blocks. Just return the raw JSON string.
      
      Text to analyze:
      "${rawText}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    // 5. Safe Parsing
    // Sometimes AI wraps JSON in \`\`\`json ... \`\`\`, we need to clean that
    const cleanJson = textResponse.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(cleanJson);

    // 6. Save to Database
    const newArticle = await Article.create({
      userId,
      originalUrl: url,
      title: aiData.title || metaTitle, // Fallback to scraped title if AI fails
      aiSummary: aiData.summary,
      tags: aiData.tags,
      isRead: false,
    });

    res.status(201).json(newArticle);
  } catch (error: any) {
    console.error("Analysis Failed:", error);
    res.status(500).json({
      message: "Failed to process article",
      error: error.message,
    });
  }
};