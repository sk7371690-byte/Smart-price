import React from 'react';
import { PackageSearch, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No Matching Products Found',
  description = 'We could not locate any live offers for your search query. Try checking for typos or searching a broader term.',
  actionText = 'View All Products',
  actionLink = '/search'
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
        <PackageSearch className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
}
