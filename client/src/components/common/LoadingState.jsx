import React from 'react';

export default function LoadingState({ message = 'Aggregating live prices from retailers...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative w-16 h-16 mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-800">{message}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        Comparing active offers across Amazon, Flipkart, Myntra, and Croma...
      </p>
    </div>
  );
}
