import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  LogOut,
  Search,
} from "lucide-react";
import { ArticleCard } from "../components/ArticleCard";
import { useAuthStore } from "../store/useAuthStore";
import { API_URL } from "../utils/api";

// Define Article Interface
interface Article {
  _id: string;
  title: string;
  aiSummary: string;
  tags: string[];
  originalUrl: string;
  createdAt: string;
}

export const DashboardPage: React.FC = () => {
  const [url, setUrl] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // Zustand Store Hooks
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // 1. Protect the Route & Fetch Data
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchArticles();
  }, [user, navigate]);

  const fetchArticles = async () => {
    if (!user) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/articles/${user._id}`
      );
      setArticles(res.data);
    } catch (error) {
      console.error("Error fetching articles", error);
    }
  };

  // 2. Handle Logout
  const handleLogout = () => {
    logout(); // Clear store
    navigate("/"); // Go to Landing Page
  };

  // 3. Handle Summarize
  const handleSummarize = async () => {
    if (!url || !user) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/summary`,
        {
          url: url,
          userId: user._id,
        }
      );
      // Add new article to top of list
      setArticles([response.data, ...articles]);
      setUrl("");
    } catch (error) {
      console.error("Failed to summarize", error);
      alert("Failed to process link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if not logged in (prevents flash)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#09090b] pb-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="pt-8 pb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-600 rounded-xl shadow-lg shadow-violet-500/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none">
                Dashboard
              </h1>
              <p className="text-zinc-500 text-xs font-medium mt-1">
                Welcome back, {user.name.split(" ")[0]}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 hover:bg-zinc-900 hover:border-red-500/30 hover:text-red-400 text-zinc-400 text-sm font-medium transition-all"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <LogOut size={16} />
          </button>
        </div>

        {/* Input Section */}
        <div className="mb-10 relative z-10 group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-[#09090b] rounded-2xl p-2 shadow-2xl border border-zinc-800">
            <div className="pl-4 text-zinc-500">
              <LinkIcon size={20} />
            </div>
            <input
              type="text"
              placeholder="Paste article URL here (Medium, Dev.to, Blogs)..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSummarize()}
              className="grow bg-transparent text-zinc-100 placeholder-zinc-500 px-4 py-3 text-base outline-none w-full"
            />
            <button
              onClick={handleSummarize}
              disabled={loading || !url}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-900/20"
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

        {/* Filters / Status Bar (Optional Polish) */}
        <div className="flex items-center justify-between mb-6 text-sm text-zinc-500">
          <div>Your Library ({articles.length})</div>
          {/* You could add a search bar here later */}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loading Skeleton */}
          {loading && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-pulse h-[280px] flex flex-col">
              <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                <div className="h-4 bg-zinc-800 rounded w-4/6"></div>
              </div>
              <div className="mt-auto flex gap-2">
                <div className="h-6 w-16 bg-zinc-800 rounded"></div>
              </div>
            </div>
          )}

          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}

          {/* Empty State */}
          {!loading && articles.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-4 shadow-inner">
                <Search className="text-zinc-600" size={24} />
              </div>
              <h3 className="text-zinc-300 font-medium text-lg">
                Your library is empty
              </h3>
              <p className="text-zinc-500 mt-2 max-w-sm mx-auto">
                Paste a URL above to let our AI summarize, tag, and organize
                your first article.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DashboardPage