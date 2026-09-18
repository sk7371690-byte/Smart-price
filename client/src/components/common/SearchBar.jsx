import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';

const POPULAR_TAGS = [
  'Nike Air Max 270',
  'Samsung Galaxy S24',
  'MacBook Air M2',
  'Sony WH-1000XM5',
  'Running Shoes'
];

export default function SearchBar({ initialQuery = '', onSearch, autoFocus = false }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    if (onSearch) {
      onSearch(tag);
    } else {
      navigate(`/search?q=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border-2 border-slate-200 group-hover:border-emerald-500 group-focus-within:border-emerald-500 group-focus-within:ring-4 group-focus-within:ring-emerald-500/15 transition-all bg-white">
          <div className="pl-5 pr-2 text-slate-400">
            <Search className="h-6 w-6 text-emerald-600" />
          </div>

          <input
            type="text"
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products across Amazon, Flipkart, Myntra, Croma..."
            className="w-full py-4 sm:py-5 px-3 text-slate-900 placeholder-slate-400 text-base sm:text-lg bg-transparent focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors mr-2"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="pr-3">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl shadow-md transition-all text-sm sm:text-base"
            >
              <span>Compare</span>
              <ArrowRight className="h-4 w-4 hidden sm:inline" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Search Pills */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-500 font-medium flex items-center space-x-1 mr-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Popular searches:</span>
        </span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
