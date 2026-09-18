import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrendingDown, Mail, Lock, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@smartprice.com');
      setPassword('adminpassword123');
    } else {
      setEmail('user@smartprice.com');
      setPassword('userpassword123');
    }
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/20">
              <TrendingDown className="h-6 w-6 text-white stroke-[2.5]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Smart<span className="text-emerald-600">Price</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 pt-2">Welcome Back</h2>
          <p className="text-xs text-slate-500">
            Sign in to track wishlists, configure price-drop alerts, and compare prices.
          </p>
        </div>

        {/* Demo Credentials Quick Fill Pills */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
          <span className="font-semibold text-slate-600 flex items-center space-x-1 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>1-Click Demo Login (for Evaluation):</span>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold border border-slate-200 shadow-sm transition-all text-[11px]"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold border border-slate-200 shadow-sm transition-all text-[11px]"
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <span className="text-[11px] text-emerald-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}
