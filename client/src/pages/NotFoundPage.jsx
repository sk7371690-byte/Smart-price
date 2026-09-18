import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-7xl font-black text-emerald-600 mb-2">404</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        The page or product you are looking for might have been moved or is currently unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md"
      >
        <Home className="h-4 w-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
