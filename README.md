# SmartKeep - AI-Powered "Read Later" App

SmartKeep solves the problem of information overload. Instead of a growing list of bookmarks you never read, SmartKeep uses **Generative AI (Gemini)** to instantly read, summarize, and auto-tag articles for you.

## 🚀 Features
* **AI Summarization:** Extracts the core value of an article in 3 sentences.
* **Intelligent Auto-Tagging:** Automatically categorizes content (e.g., "React", "Finance").
* **Mobile-First Design:** A sleek, dark-mode UI optimized for touch devices.
* **Duplicate Prevention:** Smart backend logic prevents saving the same URL twice.

## 🛠 Tech Stack
* **Frontend:** React, TypeScript, Tailwind CSS (Dark Mode).
* **Backend:** Node.js, Express, TypeScript.
* **Database:** MongoDB (with Mongoose).
* **AI Engine:** Google Gemini 1.5 Flash.
* **Scraper:** Cheerio (for raw HTML parsing).

## ⚙️ Installation & Setup

### Prerequisites
* Node.js installed.
* A MongoDB connection string (Local or Atlas).
* A Google Gemini API Key.

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file in the backend/ folder with:
# PORT=3000
# MONGO_URI=your_mongodb_connection_string
# GEMINI_API_KEY=your_gemini_key

npm run dev