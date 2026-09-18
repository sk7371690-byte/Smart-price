import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Search,
  Zap,
  ArrowRight,
  Store,
  Layers,
  BarChart3,
  BellRing,
  CheckCircle,
  Smartphone,
  Laptop,
  Headphones,
  Footprints
} from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import ProductCard from '../components/product/ProductCard';
import { mockProducts } from '../utils/mockProducts';

const CATEGORIES = [
  { name: 'Mobiles', icon: Smartphone, count: '1,240 Deals', color: 'from-blue-500 to-indigo-600' },
  { name: 'Laptops', icon: Laptop, count: '680 Deals', color: 'from-violet-500 to-purple-600' },
  { name: 'Audio', icon: Headphones, count: '940 Deals', color: 'from-amber-500 to-orange-600' },
  { name: 'Footwear', icon: Footprints, count: '1,560 Deals', color: 'from-emerald-500 to-teal-600' }
];

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tag badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>India's Smartest Multi-Store Price Comparison Engine</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Search once. <br className="hidden sm:inline" />
              Compare everywhere. <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Buy smarter.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Don't overpay for electronics or lifestyle items. We compare prices across Amazon, Flipkart, Myntra, and Croma in real time, calculating actual shipping and discount costs.
            </p>

            {/* Central Search Bar */}
            <div className="pt-2">
              <SearchBar autoFocus={false} />
            </div>

            {/* Trust Metrics */}
            <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Zero Hidden Delivery Fees</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Verified Retailer Feeds</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>AI Query Normalization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top curated products with verified price comparisons
            </p>
          </div>
          <Link
            to="/search"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Price-Drop Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>Today's Top Price Drops</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Deepest Discounts Today
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                Products currently at their lowest historical prices across retailers
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all self-start md:self-auto"
            >
              <span>Explore All Price Drops</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-900">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. How SmartPrice Works (3 Simple Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How SmartPrice Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered to calculate the true bottom-line cost with zero manual effort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative text-center">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-black mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Search Any Product</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter a product title, model, or brand. Our engine matches variants and specifications across stores.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative text-center">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto text-xl font-black mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Effective Price Calculation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We compute <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">Price + Delivery - Coupons</code> to expose the actual amount you pay.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative text-center">
            <div className="h-14 w-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-black mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Buy Direct & Save</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Click "Buy Now" to navigate straight to the retailer's official listing with the guaranteed lowest price.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Key Platform Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Multi-Retailer Providers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pluggable provider architecture integrating Amazon India, Flipkart, Myntra, and Tata Croma simultaneously.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Historical Price Charts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualize product pricing timelines to verify whether a "sale" is genuinely good or an inflated discount.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <BellRing className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smart Price Alerts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set a target price threshold (e.g. "Below ₹4,500") and receive instant notifications when prices plunge.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
