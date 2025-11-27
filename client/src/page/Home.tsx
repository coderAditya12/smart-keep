import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Zap,
  Brain,
  Layout,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-violet-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] translate-y-1/2"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-linear-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">SmartKeep</span>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Log in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-violet-400 mb-8 animate-fade-in-up">
            <Zap size={12} className="fill-current" />
            <span>Powered by Gemini 1.5 AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Stop hoarding tabs. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-indigo-400 to-sky-400">
              Start learning now.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Your reading list is a graveyard of good intentions. SmartKeep uses
            AI to read, summarize, and organize your articles instantly, turning
            information into insight.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="group w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Get Started for Free
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-full font-medium hover:bg-zinc-800 transition-colors">
              View Demo
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="text-violet-400" />}
            title="AI Summarization"
            desc="Don't have 20 minutes? Get the core value of any article in a 3-bullet summary instantly."
          />
          <FeatureCard
            icon={<Layout className="text-indigo-400" />}
            title="Auto-Tagging"
            desc="Forget manual organization. Our AI categorizes your content by topic, tech stack, or industry."
          />
          <FeatureCard
            icon={<CheckCircle2 className="text-sky-400" />}
            title="Duplicate Protection"
            desc="Never save the same link twice. We keep your library clean, distinct, and duplicate-free."
          />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-zinc-900 py-12 text-center text-zinc-600 text-sm relative z-10">
        <p>
          &copy; {new Date().getFullYear()} SmartKeep AI. Built for the future.
        </p>
      </footer>
    </div>
  );
};

// Helper Component for Features
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
}> = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-violet-500/30 transition-colors group">
    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-zinc-100 mb-3">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{desc}</p>
  </div>
);
