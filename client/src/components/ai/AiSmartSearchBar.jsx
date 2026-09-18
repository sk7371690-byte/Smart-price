import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft, Tag, Layers, SlidersHorizontal, Loader2 } from 'lucide-react';
import { parseQueryApi } from '../../services/aiApi';

const SAMPLE_PROMPTS = [
  'Best Asus gaming laptop under 70k with 16GB RAM',
  'Noise cancelling Sony headphones under 15000',
  'Nike running shoes under 4000 size UK 9',
  'iPhone 15 128GB blue best price',
];

export default function AiSmartSearchBar({ onAiSearch, initialQuery = '' }) {
  const [prompt, setPrompt] = useState(initialQuery);
  const [parsing, setParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  const handleParseAndSearch = async (textToSearch) => {
    const queryToUse = textToSearch || prompt;
    if (!queryToUse.trim()) return;

    try {
      setParsing(true);
      const res = await parseQueryApi(queryToUse);
      if (res.success && res.data) {
        setParsedResult(res.data);
        if (onAiSearch) {
          onAiSearch(res.data, queryToUse);
        }
      }
    } catch (err) {
      console.warn('[AiSmartSearchBar] Error:', err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleParseAndSearch();
    }
  };

  const handlePresetClick = (sample) => {
    setPrompt(sample);
    handleParseAndSearch(sample);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-indigo-100 shadow-xl p-5 sm:p-7 space-y-5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Natural Language AI Search</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white tracking-wide uppercase">
                GPT / NLP POWERED
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Type naturally — our parser extracts specifications, budget limits, and matching brands.
            </p>
          </div>
        </div>
      </div>

      {/* Main Prompt Input */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 'Best lightweight laptop under 60000 with 16GB RAM for coding'..."
          className="w-full pl-5 pr-28 sm:pr-36 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-slate-800 text-sm sm:text-base outline-none transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
        />

        <button
          onClick={() => handleParseAndSearch()}
          disabled={parsing || !prompt.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5"
        >
          {parsing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Parsing...</span>
            </>
          ) : (
            <>
              <span>Ask AI</span>
              <CornerDownLeft className="h-4 w-4 hidden sm:inline" />
            </>
          )}
        </button>
      </div>

      {/* Sample Quick Prompts */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Try Sample Prompts:</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(sample)}
              className="text-xs text-slate-600 hover:text-indigo-600 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-slate-200 transition-all text-left flex items-center space-x-1.5"
            >
              <Tag className="h-3 w-3 text-slate-400" />
              <span>{sample}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Interpretation / Extracted Filter Chips */}
      {parsedResult && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
            <div className="flex items-center space-x-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
              <span>Extracted AI Intent & Filters</span>
            </div>
            <span className="text-[10px] text-indigo-500 font-semibold uppercase">
              Intent: {parsedResult.intent}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {parsedResult.criteriaChips && parsedResult.criteriaChips.length > 0 ? (
              parsedResult.criteriaChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-slate-800 text-xs font-semibold shadow-xs"
                  dangerouslySetInnerHTML={{
                    __html: chip.replace(/\*\*(.*?)\*\*/g, '<span class="text-indigo-600 font-bold">$1</span>')
                  }}
                />
              ))
            ) : (
              <span className="text-xs text-slate-600">General search keywords extracted.</span>
            )}
          </div>

          <p className="text-xs text-indigo-950 font-medium pt-1 border-t border-indigo-200/50">
            {parsedResult.summary}
          </p>
        </div>
      )}
    </div>
  );
}
