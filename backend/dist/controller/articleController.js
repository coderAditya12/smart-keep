import { GoogleGenerativeAI } from "@google/generative-ai";
import puppeteer from "puppeteer"; // We use this instead of axios now
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { Article } from "../models/Article.model.js";
dotenv.config();
export const analyzeAndSave = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing from environment variables");
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const { url, userId } = req.body;
        // 2. Check for Duplicates
        const existingArticle = await Article.findOne({ userId, originalUrl: url });
        if (existingArticle) {
            return res.status(200).json(existingArticle);
        }
        // 3. Scrape with Puppeteer (Bypasses Cloudflare)
        // Launch a headless browser
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        // Get the full HTML
        const html = await page.content();
        // Close the browser to free up RAM
        await browser.close();
        // 4. Clean the Content with Cheerio
        const $ = cheerio.load(html);
        // Remove junk
        $("script, style, nav, footer, iframe, header, aside, .ad, .advertisement, .cookie-banner").remove();
        // Get text
        const rawText = $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 10000); // Increased limit slightly
        const metaTitle = $("title").text().trim() || "Untitled Article";
        if (rawText.length < 100) {
            throw new Error("Could not extract enough text from this page. It might be behind a login.");
        }
        // 5. AI Processing
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
      Analyze the following article text.
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
        // Clean Markdown wrapper if present
        const cleanJson = textResponse.replace(/```json|```/g, "").trim();
        let aiData;
        try {
            aiData = JSON.parse(cleanJson);
        }
        catch (e) {
            // Fallback if AI returns bad JSON
            console.error("AI JSON Parse Error:", cleanJson);
            aiData = {
                summary: "Summary generation failed, but link is saved.",
                tags: ["Uncategorized"],
                title: metaTitle,
            };
        }
        // 6. Save to Database
        const newArticle = await Article.create({
            userId,
            originalUrl: url,
            title: aiData.title || metaTitle,
            aiSummary: aiData.summary,
            tags: aiData.tags,
            isRead: false,
        });
        res.status(201).json(newArticle);
    }
    catch (error) {
        console.error("Analysis Failed:", error);
        res.status(500).json({
            message: "Failed to process article",
            error: error.message || "Unknown error",
        });
    }
};
export const getArticles = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        res.status(404).json("userId is required");
    }
    try {
        const allArticles = await Article.find({ userId });
        res.status(200).json(allArticles);
    }
    catch (error) {
        res.status(500).json("internal Server error");
    }
};
