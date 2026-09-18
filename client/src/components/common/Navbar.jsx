import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingDown,
  Search,
  Heart,
  Bell,
  User as UserIcon,
  Menu,
  X,
  Layers,
  LogOut,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <TrendingDown className="h-6 w-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Smart<span className="text-emerald-600">Price</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                Compare & Save
              </span>
            </div>
          </Link>

          {/* Center Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl items-center relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search iPhone, Nike Shoes, Laptops, Sony..."
                className="w-full pl-11 pr-24 py-2.5 rounded-full border border-slate-300 bg-slate-50 focus:bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
              >
                Compare
              </button>
            </div>
          </form>

          {/* Navigation Actions */}
          <div className="hidden lg:flex items-center space-x-5">
            <Link
              to="/search"
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors flex items-center space-x-1"
            >
              <Layers className="h-4 w-4" />
              <span>Explore Deals</span>
            </Link>

            <div className="h-5 w-px bg-slate-200" />

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              title="Saved Wishlist"
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors relative"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </Link>

            {/* Authenticated User Menu vs Guest Login/Register */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-xs shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user?.name}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Administrator
                        </span>
                      )}
                    </div>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Saved Wishlist
                    </Link>

                    <Link
                      to="/alerts"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Price Drop Alerts
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 transition-colors"
                      >
                        ⚡ Admin Operations
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center space-x-1.5"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, models..."
              className="w-full pl-10 pr-20 py-2 rounded-full border border-slate-300 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 space-y-3">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Explore Deals
            </Link>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-slate-200 px-3 space-y-2">
                <div className="flex items-center space-x-2 pb-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 bg-rose-50 text-rose-700 rounded-xl font-semibold text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-slate-100 text-slate-800 rounded-xl font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
