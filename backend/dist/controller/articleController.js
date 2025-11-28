import { GoogleGenerativeAI } from "@google/generative-ai";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import dotenv from "dotenv"; // Removed .js extension
import { Article } from "../models/Article.model.js";
dotenv.config();
export const analyzeAndSave = async (req, res) => {
    let browser = null;
    try {
        // 1. Validation & Setup
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
        // 3. Scrape with Puppeteer (Memory Optimized)
        browser = await puppeteer.launch({
            headless: true,
            pipe: true, // Use pipe instead of WebSocket for stability on Render
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage", // Critical for low-RAM environments
                "--disable-accelerated-2d-canvas",
                "--disable-gpu",
                "--no-first-run",
                "--no-zygote",
                "--disable-extensions",
                "--disable-features=IsolateOrigins,site-per-process", // Note the correct syntax
                "--disable-software-rasterizer",
                "--mute-audio",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding",
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        });
        const page = await browser.newPage();
        // Block Images/Fonts/CSS to save RAM
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const resourceType = req.resourceType();
            if (["image", "stylesheet", "font", "media", "other"].includes(resourceType)) {
                req.abort();
            }
            else {
                req.continue();
            }
        });
        // Navigate (Fail fast if site is too heavy: 30s timeout)
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        const html = await page.content();
        // Close browser immediately after getting HTML
        await browser.close();
        browser = null;
        // 4. Clean Content with Cheerio
        const $ = cheerio.load(html);
        $("script, style, nav, footer, iframe, header, aside, .ad, .advertisement, .cookie-banner").remove();
        const rawText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 7000); // Limit text length for token optimization
        const metaTitle = $("title").text().trim() || "Untitled Article";
        if (rawText.length < 100) {
            throw new Error("Could not extract enough text from this page. It might be behind a login.");
        }
        // 5. AI Processing
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use 1.5-flash (Stable)
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
            console.error("AI JSON Parse Error:", cleanJson);
            // Fallback
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
        console.error("Analysis Failed:", error.message);
        res.status(500).json({
            message: "Failed to process article",
            error: error.message || "Unknown error",
        });
    }
    finally {
        // Critical: Ensure browser closes even if errors occur
        if (browser) {
            await browser.close().catch(() => console.log("Browser closure failed"));
        }
    }
};
export const getArticles = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const allArticles = await Article.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(allArticles);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
