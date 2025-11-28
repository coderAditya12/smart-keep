# SmartKeep - AI-Powered "Read Later" App

SmartKeep solves the problem of information overload. Instead of a growing list of bookmarks you never read, SmartKeep uses **Generative AI (Gemini)** to instantly read, summarize, and auto-tag articles for you.

## 🚀 Key Features
* **Cloudflare-Proof Scraping:** Uses `Puppeteer` (Headless Chrome) to bypass bot protection on sites like Medium or DataCamp.
* **AI Summarization:** Gemini 2.5 Flash generates concise 3-bullet summaries and auto-tags content.
* **Identity-Based Auth:** Simple, passwordless login flow (Email/Name) allows users to maintain their own private library.
* **Persistent State:** Uses `Zustand` with local storage persistence to keep users logged in.

## 🛠 Tech Stack
* **Frontend:** React, TypeScript, Tailwind CSS, Zustand, Framer Motion (for transitions).
* **Backend:** Node.js, Express, Puppeteer, Cheerio.
* **Database:** MongoDB.

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