import React, { useState } from 'react';
import { Bell, X, CheckCircle2, TrendingDown } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

import { createAlertApi } from '../../services/userFeaturesApi';

export default function PriceAlertModal({ isOpen, onClose, product, currentPrice, initialTargetPrice }) {
  const [targetPrice, setTargetPrice] = useState(
    initialTargetPrice || (currentPrice ? Math.round(currentPrice * 0.9) : '')
  );

  React.useEffect(() => {
    if (initialTargetPrice) {
      setTargetPrice(initialTargetPrice);
    } else if (currentPrice) {
      setTargetPrice(Math.round(currentPrice * 0.9));
    }
  }, [initialTargetPrice, currentPrice]);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetPrice || !email) return;

    try {
      setLoading(true);
      setError(null);
      await createAlertApi({
        productId: product._id || product.id,
        targetPrice: Number(targetPrice),
        email,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to register price alert.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Alert Set Successfully!</h3>
            <p className="text-sm text-slate-500">
              We will instantly notify <strong className="text-slate-800">{email}</strong> when{' '}
              {product.title} drops below {formatINR(targetPrice)}.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Price Drop Alert</h3>
                <p className="text-xs text-slate-500">Never miss a sudden price cut or discount deal</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-5 flex items-center space-x-3">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-12 w-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{product.title}</p>
                <p className="text-xs text-slate-500">
                  Current lowest price: <span className="font-bold text-emerald-600">{formatINR(currentPrice)}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Notify me when price drops below (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    required
                    min={1}
                    max={currentPrice}
                    placeholder="e.g. 4500"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900 text-sm"
                  />
                </div>
                {targetPrice && currentPrice > targetPrice && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center space-x-1">
                    <TrendingDown className="h-3 w-3" />
                    <span>
                      {Math.round(((currentPrice - targetPrice) / currentPrice) * 100)}% lower than current price
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Notification Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
                >
                  Set Price Alert
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
