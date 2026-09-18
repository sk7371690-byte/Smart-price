import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, Star, ArrowRight, Store, ShieldCheck } from 'lucide-react';
import { formatINR, calculateDiscountPercent } from '../../utils/formatCurrency';

export default function ProductCard({ product }) {
  const productId = product._id || product.id;
  const imageSrc = product.thumbnailUrl || product.thumbnail;
  
  // Resolve lowest offer: either precomputed on product or from offers array
  let effectivePrice = product.lowestOffer?.effectivePrice;
  let retailerName = product.lowestOffer?.retailerName;
  let highestMrp = product.lowestOffer?.price;

  if (!effectivePrice && product.offers?.length) {
    const sorted = [...product.offers].sort((a, b) => a.effectivePrice - b.effectivePrice);
    effectivePrice = sorted[0].effectivePrice;
    retailerName = sorted[0].retailer?.name || sorted[0].retailer;
    highestMrp = sorted[0].mrp;
  }

  const discountPercent = calculateDiscountPercent(highestMrp || effectivePrice * 1.3, effectivePrice);
  const storeCount = product.offers?.length || 4;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image & Badges */}
      <div className="relative pt-[85%] bg-slate-50 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm border border-slate-200/60">
            {product.category}
          </span>
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-emerald-600 text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Store Count Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/80 backdrop-blur-sm text-white shadow">
            <Store className="h-3 w-3 text-emerald-400" />
            <span>{storeCount} stores compared</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-emerald-700">
              {product.brand}
            </span>
            <div className="flex items-center space-x-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 font-semibold">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.6}</span>
            </div>
          </div>

          {/* AI Deal Score Pill (if smart-searched) */}
          {product.aiAnalysis && (
            <div className="mb-2">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span>✨ Deal Score: {product.aiAnalysis.dealScore}/100</span>
                <span>•</span>
                <span>{product.aiAnalysis.verdict?.label?.split('—')[0]?.trim()}</span>
              </span>
            </div>
          )}

          {/* Title */}
          <Link to={`/product/${productId}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing Highlights */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-1">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Lowest Price:</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-black text-slate-900">
                  {formatINR(effectivePrice)}
                </span>
                {highestMrp > effectivePrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatINR(highestMrp)}
                  </span>
                )}
              </div>
            </div>

            {/* Winning Retailer */}
            {retailerName && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                on {retailerName}
              </span>
            )}
          </div>

          {/* Action Link */}
          <Link
            to={`/product/${productId}`}
            className="mt-3 w-full inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <span>Compare Deals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
