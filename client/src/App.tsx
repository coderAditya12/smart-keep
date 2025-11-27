import { useState } from "react";
import axios from "axios";
import { Plus, Loader2, Sparkles, Link as LinkIcon } from "lucide-react";
import { ArticleCard } from "./components/ArticleCard";

interface Article {
  _id: string;
  title: string;
  aiSummary: string;
  tags: string[];
  originalUrl: string;
  createdAt: string;
}

function App() {
  const [url, setUrl] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // Hardcoded UserID for MVP
  const USER_ID = "692808a2590defcbad6c2b11";

  const handleSummarize = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/summary", {
        url: url,
        userId: USER_ID,
      });
      setArticles([response.data, ...articles]);
      setUrl("");
    } catch (error) {
      console.error("Failed to summarize", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* 1. Mobile-First Header */}
      <div className="pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-600 rounded-lg shadow-lg shadow-violet-500/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            SmartKeep
          </h1>
        </div>
        <div className="text-xs font-medium text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          {articles.length} Saved
        </div>
      </div>

      {/* 2. The Input Area (Sticky on Mobile?? No, let's keep it static at top for simplicity but styled boldly) */}
      <div className="mb-8 relative z-10">
        <div className="absolute -inset-0.5 bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl blur opacity-30 animate-pulse"></div>
        <div className="relative flex items-center bg-zinc-900 rounded-xl p-1.5 shadow-2xl border border-zinc-800">
          <div className="pl-3 text-zinc-500">
            <LinkIcon size={20} />
          </div>
          <input
            type="text"
            placeholder="Paste article URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="grow bg-transparent text-white placeholder-zinc-500 px-3 py-3 text-base outline-none w-full"
          />
          <button
            onClick={handleSummarize}
            disabled={loading || !url}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-900/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Plus size={20} />
            )}
            <span className="hidden sm:inline">Summarize</span>
          </button>
        </div>
      </div>

      {/* 3. The Grid (1 Col Mobile -> 2 Col Tablet -> 3 Col Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Loading Skeleton Card (Optional Visual Polish) */}
        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-pulse h-64 flex flex-col">
            <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-zinc-800 rounded w-5/6 mb-2"></div>
            <div className="mt-auto flex gap-2">
              <div className="h-6 w-16 bg-zinc-800 rounded"></div>
              <div className="h-6 w-16 bg-zinc-800 rounded"></div>
            </div>
          </div>
        )}

        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
              <LinkIcon className="text-zinc-600" size={24} />
            </div>
            <h3 className="text-zinc-300 font-medium text-lg">
              No articles yet
            </h3>
            <p className="text-zinc-500 mt-1 max-w-sm mx-auto">
              Paste a link above to let AI read, tag, and summarize it for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
