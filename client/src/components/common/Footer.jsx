import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <TrendingDown className="h-5 w-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Smart<span className="text-emerald-400">Price</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-driven multi-store price intelligence platform. Aggregating live prices, effective delivery fees, and historical dips across top Indian e-commerce stores.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Genuine Retailer Feeds</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/search?category=Mobiles" className="hover:text-emerald-400 transition-colors">
                  Smartphones & 5G Mobiles
                </Link>
              </li>
              <li>
                <Link to="/search?category=Laptops" className="hover:text-emerald-400 transition-colors">
                  Laptops & MacBooks
                </Link>
              </li>
              <li>
                <Link to="/search?category=Audio" className="hover:text-emerald-400 transition-colors">
                  Headphones & TWS Earbuds
                </Link>
              </li>
              <li>
                <Link to="/search?category=Footwear" className="hover:text-emerald-400 transition-colors">
                  Sneakers & Sports Footwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Retailers */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Monitored Stores
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Amazon India (Prime & Standard)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Flipkart (Plus & Assured)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Myntra Fashion & Lifestyle</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span>Tata Croma Electronics</span>
              </li>
            </ul>
          </div>

          {/* Academic & Engineering Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Project Information
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built as a comprehensive 4th-year B.Tech Capstone Project. Demonstrates full-stack MERN engineering, clean architecture, and product matching algorithms.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Stack:</span> React 18, Tailwind, Node.js, Express, MongoDB Mongoose.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SmartPrice Platform. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Affiliate Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
