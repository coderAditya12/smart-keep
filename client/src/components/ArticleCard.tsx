import React from "react";
import { ExternalLink, Tag, Calendar, } from "lucide-react";

interface ArticleProps {
  article: {
    _id: string;
    title: string;
    aiSummary: string;
    tags: string[];
    originalUrl: string;
    createdAt: string;
  };
}

export const ArticleCard: React.FC<ArticleProps> = ({ article }) => {
  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-violet-900/10 flex flex-col h-full">
      {/* Card Header */}
      <div className="flex justify-between items-start gap-3 mb-4">
        <h3 className="text-lg font-semibold text-zinc-100 leading-snug group-hover:text-violet-400 transition-colors">
          {article.title}
        </h3>
        <a
          href={article.originalUrl}
          target="_blank"
          rel="noreferrer"
          className="text-zinc-500 hover:text-white transition-colors p-1"
        >
          <ExternalLink size={18} />
        </a>
      </div>

      {/* AI Summary Section */}
      <div className="mb-4">
        <p className="text-sm text-zinc-400 leading-relaxed">
          {article.aiSummary}
        </p>
      </div>

      {/* Footer Area (Tags + Date) */}
      <div className="mt-auto pt-4 border-t border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20"
            >
              <Tag size={10} className="mr-1.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Date */}
        <div className="flex items-center text-xs text-zinc-600 font-medium">
          <Calendar size={12} className="mr-1.5" />
          {new Date(article.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
};
