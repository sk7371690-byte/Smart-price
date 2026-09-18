import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingDown, ShieldAlert, Award, ArrowRight, Bell, CheckCircle, Info } from 'lucide-react';
import { getRecommendationApi } from '../../services/aiApi';
import { formatINR } from '../../utils/formatCurrency';

export default function AiBuyingAdvisor({ product, offers = [], priceHistory = [], onOpenAlertModal }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAnalysis() {
      if (!product) return;
      try {
        setLoading(true);
        const res = await getRecommendationApi({
          productId: product._id || product.id,
          product,
          offers,
          priceHistory,
        });
        if (isMounted && res.success && res.data) {
          setAnalysis(res.data);
        }
      } catch (err) {
        console.warn('[AiBuyingAdvisor] Error:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAnalysis();
    return () => {
      isMounted = false;
    };
  }, [product, offers, priceHistory]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl animate-pulse space-y-4">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Sparkles className="h-5 w-5 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider">AI Buying Advisor Running Diagnostics...</span>
        </div>
        <div className="h-6 bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-800 rounded w-2/3" />
      </div>
    );
  }

  if (!analysis) return null;

  const { dealScore, subScores, verdict, rationale, suggestedAlertPrice, metrics } = analysis;

  // Visual meter styling based on deal score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 65) return 'text-blue-400 stroke-blue-500';
    if (score >= 45) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const scoreColor = getScoreColor(dealScore);
  const strokeDashoffset = 283 - (283 * dealScore) / 100;

  return (
    <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/20 relative overflow-hidden space-y-6">
      {/* Background ambient glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold tracking-tight text-white">AI Deal Advisor</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm">
                ALGORITHMIC INSIGHT
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-factor price spread & historical volatility evaluation</p>
          </div>
        </div>

        {/* Verdict Badge */}
        <div className={`px-3.5 py-1.5 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-lg ${
          verdict.status === 'STRONG_BUY'
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
            : verdict.status === 'GOOD_DEAL'
            ? 'bg-blue-950/80 text-blue-300 border-blue-500/50'
            : verdict.status === 'FAIR_PRICE'
            ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
            : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
        }`}>
          {verdict.status === 'STRONG_BUY' && <Award className="h-4 w-4" />}
          {verdict.status === 'GOOD_DEAL' && <CheckCircle className="h-4 w-4" />}
          {verdict.status === 'WAIT_FOR_SALE' && <ShieldAlert className="h-4 w-4" />}
          <span>{verdict.label}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Deal Score Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className={`${scoreColor} transition-all duration-1000 ease-out`}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-black ${scoreColor}`}>{dealScore}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">/ 100 Deal Score</span>
            </div>
          </div>
          <p className="text-xs text-center font-medium text-slate-300 mt-2 px-2">
            {verdict.shortAdvice}
          </p>
        </div>

        {/* Sub-Score Breakdown Bars */}
        <div className="md:col-span-8 space-y-3.5 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Historical Price Trend (vs 90-Day Avg)</span>
              <span className="text-indigo-400">{subScores.historical}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-700"
                style={{ width: `${subScores.historical}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Multi-Retailer Arbitrage Spread</span>
              <span className="text-indigo-400">{subScores.retailerSpread}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-700"
                style={{ width: `${subScores.retailerSpread}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Customer Satisfaction & Verified Rating</span>
              <span className="text-indigo-400">{subScores.rating}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-700"
                style={{ width: `${subScores.rating}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Fulfillment & Delivery Efficiency</span>
              <span className="text-indigo-400">{subScores.fulfillment}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${subScores.fulfillment}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Natural Language Synthesized Rationale */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
        <div className="flex items-center space-x-1.5 text-indigo-300 font-bold text-xs uppercase tracking-wide">
          <Info className="h-4 w-4" />
          <span>AI Deal Rationale</span>
        </div>
        <p dangerouslySetInnerHTML={{
          __html: rationale.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-extrabold">$1</strong>')
        }} />
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <TrendingDown className="h-4 w-4 text-emerald-400" />
          <span>
            Target alert suggested by AI:{' '}
            <strong className="text-white font-bold">{formatINR(suggestedAlertPrice)}</strong>
          </span>
        </div>

        {onOpenAlertModal && (
          <button
            onClick={() => onOpenAlertModal(suggestedAlertPrice)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Set Alert at {formatINR(suggestedAlertPrice)}</span>
          </button>
        )}
      </div>
    </div>
  );
}
