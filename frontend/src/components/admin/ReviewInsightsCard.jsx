import React, { useEffect, useState } from 'react';
import { Sparkles, ThumbsUp, Minus, ThumbsDown, MessageSquareQuote } from 'lucide-react';
import API from '../../api/axiosInstance';

export default function ReviewInsightsCard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/ai/analyze-reviews');
      setInsights(data);
    } catch (err) {
      console.warn('Review insights fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-center h-48">
        <div className="flex items-center gap-3 text-purple-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-semibold">Gemini AI analyzing customer feedback...</span>
        </div>
      </div>
    );
  }

  const total = (insights?.positiveCount || 0) + (insights?.neutralCount || 0) + (insights?.negativeCount || 0) || 1;
  const posPct = Math.round(((insights?.positiveCount || 0) / total) * 100);
  const neuPct = Math.round(((insights?.neutralCount || 0) / total) * 100);
  const negPct = Math.round(((insights?.negativeCount || 0) / total) * 100);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Customer Sentiment & Review Insights</h3>
            <p className="text-xs text-slate-400">Real-time NLP analysis powered by Gemini API</p>
          </div>
        </div>
        <button
          onClick={fetchInsights}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20"
        >
          Refresh AI Analysis
        </button>
      </div>

      {/* Progress Bar & Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-emerald-400 flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" /> Positive ({posPct}%)
          </span>
          <span className="text-amber-400 flex items-center gap-1">
            <Minus className="w-3.5 h-3.5" /> Neutral ({neuPct}%)
          </span>
          <span className="text-rose-400 flex items-center gap-1">
            <ThumbsDown className="w-3.5 h-3.5" /> Negative ({negPct}%)
          </span>
        </div>

        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
          <div style={{ width: `${posPct}%` }} className="h-full bg-emerald-500 transition-all duration-500" />
          <div style={{ width: `${neuPct}%` }} className="h-full bg-amber-500 transition-all duration-500" />
          <div style={{ width: `${negPct}%` }} className="h-full bg-rose-500 transition-all duration-500" />
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-4 flex gap-3">
        <MessageSquareQuote className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Executive AI Summary</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {insights?.summary || "Customers overwhelmingly praise flavor profile and presentation. Prompt delivery times noted as a key differentiator."}
          </p>
        </div>
      </div>

      {/* Key Topic Highlights */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 mb-2">Key Extracted Highlights</h4>
        <div className="flex flex-wrap gap-2">
          {insights?.keyHighlights?.map((hl, i) => (
            <span key={i} className="text-xs font-medium text-purple-200 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg">
              {hl}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
