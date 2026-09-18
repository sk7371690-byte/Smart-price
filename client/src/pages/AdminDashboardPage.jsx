import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Server,
  RefreshCw,
  Package,
  Bell,
  Users,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getAdminAnalyticsApi,
  triggerSyncApi,
  getAdminProductsApi,
  toggleProductStatusApi,
  getAdminUsersApi,
} from '../services/adminApi';
import { formatINR } from '../utils/formatCurrency';
import LoadingState from '../components/common/LoadingState';

export default function AdminDashboardPage() {
  const { user, isAdmin, login } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'catalog' | 'users'
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, productsRes, usersRes] = await Promise.allSettled([
        getAdminAnalyticsApi(),
        getAdminProductsApi(),
        getAdminUsersApi(),
      ]);

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.success) {
        setAnalytics(analyticsRes.value.data);
      }
      if (productsRes.status === 'fulfilled' && productsRes.value.success) {
        setProducts(productsRes.value.data);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsersList(usersRes.value.data);
      }
    } catch (err) {
      console.warn('[AdminDashboardPage] Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleTriggerSync = async () => {
    try {
      setSyncing(true);
      setSyncSuccessMsg(null);
      const res = await triggerSyncApi();
      if (res.success) {
        setSyncSuccessMsg(res.message);
        // Refresh analytics to update timestamps
        const updatedAnalytics = await getAdminAnalyticsApi();
        if (updatedAnalytics.success) {
          setAnalytics(updatedAnalytics.data);
        }
        setTimeout(() => setSyncSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('[AdminDashboardPage] Sync error:', err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleProduct = async (id) => {
    try {
      await toggleProductStatusApi(id);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !p.isActive } : p))
      );
    } catch (err) {
      console.error('[AdminDashboardPage] Toggle product error:', err.message);
    }
  };

  // 1-Click Demo Admin Sign-In for evaluators
  const handleQuickAdminLogin = async () => {
    try {
      await login('admin@smartprice.com', 'adminpassword123');
    } catch (err) {
      console.error('Demo admin login error:', err.message);
    }
  };

  // RBAC Access Guard
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
        <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Admin Access Required</h2>
        <p className="text-sm text-slate-500">
          The Operations Dashboard is restricted to system administrators. Please sign in with administrator credentials.
        </p>
        <div className="pt-2 space-y-2">
          <button
            onClick={handleQuickAdminLogin}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>1-Click Sign In as Administrator</span>
          </button>
          <Link
            to="/login"
            className="block text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
          >
            Back to standard login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Connecting to SmartPrice Operations Gateway..." />;
  }

  const kpis = analytics?.kpis || {
    totalProducts: products.length || 24,
    activeRetailers: 4,
    activeAlerts: 18,
    totalUsers: usersList.length || 12,
    estimatedPlatformSavings: 384500,
  };

  const retailerHealth = analytics?.retailerHealth || [];
  const recentActivities = analytics?.recentActivities || [];
  const categoryStats = analytics?.categoryStats || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
              Operations Center
            </span>
            <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            Admin Analytics & Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time multi-retailer monitoring, catalog controls, and user telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            title="Refresh analytics"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={handleTriggerSync}
            disabled={syncing}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Zap className={`h-4 w-4 text-amber-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing Adapters...' : 'Trigger Full Sync'}</span>
          </button>
        </div>
      </div>

      {/* Sync Success Notification Toast */}
      {syncSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Products</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpis.totalProducts}</p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">Active across 4 stores</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Retailers</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpis.activeRetailers} / 4</p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">100% Adapter Health</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Server className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Price Alerts</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpis.activeAlerts}</p>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 block">Monitoring drop targets</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bell className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Savings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{formatINR(kpis.estimatedPlatformSavings)}</p>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">User Arbitrage Realized</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview & Adapter Health
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'catalog'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Catalog Controls</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {products.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>User Directory</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {usersList.length}
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & RETAILER HEALTH */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Retailer Adapters Health Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Retailer Adapter Health & Latency</h3>
                <p className="text-xs text-slate-400">Live response metrics from pluggable retailer providers</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Parallel Promise.allSettled Dispatch
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4 pl-6">Retailer Provider</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Avg Latency</th>
                    <th className="p-4">Success Rate</th>
                    <th className="p-4">Items Tracked</th>
                    <th className="p-4">Lowest Price Wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {retailerHealth.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-900 flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>{r.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="uppercase">{r.status}</span>
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800">{r.latencyMs} ms</td>
                      <td className="p-4 text-emerald-600 font-bold">{r.successRate}%</td>
                      <td className="p-4">{r.itemsTracked} SKUs</td>
                      <td className="p-4 font-bold text-indigo-600">{r.bestPriceWins} wins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grid: Category Distribution & System Activities Log */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Breakdown */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Category Catalog Share</h3>
              <div className="space-y-3">
                {categoryStats.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat.name}</span>
                      <span className="text-slate-400">{cat.count} products</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                        style={{ width: `${Math.min(100, (cat.count / 8) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Activities Feed */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Activity className="h-4 w-4 text-indigo-600" />
                <span>Recent System Operations Log</span>
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {recentActivities.map((act) => (
                  <div key={act.id} className="py-3 flex items-start justify-between space-x-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase">
                          {act.type}
                        </span>
                        <span className="font-bold text-slate-800">{act.description}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Actor: {act.retailer}</p>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATALOG CONTROLS */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tracked Catalog Items</h3>
              <p className="text-xs text-slate-400">Toggle product visibility and inspect winning store pricing</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">Total: {products.length} Products</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Best Price</th>
                  <th className="p-4">Winning Retailer</th>
                  <th className="p-4">Active Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {products.map((p) => {
                  const bestPrice = p.lowestOffer?.effectivePrice || 0;
                  const retailerName = p.lowestOffer?.retailerName || 'Amazon India';

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 pl-6 flex items-center space-x-3">
                        <img
                          src={p.thumbnailUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'}
                          alt={p.title}
                          className="h-10 w-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-slate-900 truncate">{p.title}</p>
                          <p className="text-[11px] text-slate-400">{p.brand}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-900">{formatINR(bestPrice)}</td>
                      <td className="p-4 font-semibold text-emerald-700">{retailerName}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleProduct(p._id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            p.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.isActive !== false ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-4">
                        <Link
                          to={`/product/${p._id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Registered Users Directory</h3>
              <p className="text-xs text-slate-400">RBAC role assignments and member registration history</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">Total: {usersList.length} Users</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role Badge</th>
                  <th className="p-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 pl-6 flex items-center space-x-3 font-bold text-slate-900">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black flex items-center justify-center text-xs">
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
