import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Trash2, ArrowRight, TrendingDown, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAlertsApi, deleteAlertApi } from '../services/userFeaturesApi';
import { formatINR } from '../utils/formatCurrency';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';

export default function AlertsPage() {
  const { isAuthenticated, user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await getAlertsApi();
      if (res.success && Array.isArray(res.data)) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.warn('[AlertsPage] Error loading alerts:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    try {
      await deleteAlertApi(id);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('[AlertsPage] Delete error:', err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <Bell className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Price Alerts Dashboard</h2>
        <p className="text-sm text-slate-500">
          Sign in to monitor your customized price-drop thresholds and get notified the second a deal drops.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all"
        >
          <span>Sign In to Manage Alerts</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingState message="Loading your active price alerts..." />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="No Price Alerts Active"
          description="You haven't set any price drop alerts yet. Open any product page and click 'Price Drop Alert' to set your target price."
          actionText="Browse Popular Products"
          actionLink="/search"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-3">
          <Bell className="h-7 w-7 text-amber-500 fill-amber-500" />
          <span>Active Price Drop Alerts</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitoring price fluctuations for {alerts.length} target{alerts.length === 1 ? '' : 's'}. We will notify <strong className="text-slate-800">{user?.email}</strong> upon trigger.
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const product = alert.product || {};
          const productId = product._id || product.id;
          const currentPrice = product.lowestOffer?.effectivePrice || alert.initialPrice || 4899;
          const isTriggered = alert.isTriggered || currentPrice <= alert.targetPrice;

          return (
            <div
              key={alert._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.thumbnailUrl || product.thumbnail || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80'}
                  alt={product.title}
                  className="h-16 w-16 object-cover rounded-xl bg-slate-50 flex-shrink-0"
                />
                <div>
                  <Link to={`/product/${productId}`}>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1">
                      {product.title || 'Product Target'}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                    <span className="text-slate-500">
                      Target Threshold: <strong className="text-emerald-700">{formatINR(alert.targetPrice)}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">
                      Current Price: <strong className="text-slate-800">{formatINR(currentPrice)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                {isTriggered ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Price Dropped!</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Monitoring Feeds</span>
                  </span>
                )}

                <Link
                  to={`/product/${productId}`}
                  className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  View Deals
                </Link>

                <button
                  onClick={() => handleDelete(alert._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                  title="Cancel Alert"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
