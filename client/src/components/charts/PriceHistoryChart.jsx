import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Calendar, TrendingDown, ArrowDownRight, Award, ShieldAlert } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';
import { getPriceHistory } from '../../services/historyApi';

export default function PriceHistoryChart({ productId, defaultData }) {
  const [days, setDays] = useState(7);
  const [historyData, setHistoryData] = useState(defaultData || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await getPriceHistory(productId, days);
        if (res.success) {
          setHistoryData(res);
        }
      } catch (err) {
        console.warn('[PriceHistoryChart] Fallback to default chart data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [productId, days]);

  const timeline = historyData?.timeline || [];
  const lowestPrice = historyData?.lowestHistoricalPrice || 0;
  const highestPrice = historyData?.highestHistoricalPrice || 0;
  const currentPrice = historyData?.currentPrice || 0;
  const dropPercent = historyData?.priceDropPercentage || 0;
  const isAllTimeLow = historyData?.isAtAllTimeLow || false;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <span>Price History Timeline</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare past retail price points to verify genuine deal authenticity
          </p>
        </div>

        {/* Days Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                days === d
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Historical Metrics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Lowest Price */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Lowest Ever
            </span>
            <Award className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <p className="text-base sm:text-lg font-black text-emerald-900">
            {formatINR(lowestPrice)}
          </p>
          {isAllTimeLow && (
            <span className="inline-block mt-1 text-[10px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
              ALL-TIME LOW
            </span>
          )}
        </div>

        {/* Highest Historical Price */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 tracking-wider">
            Highest Ever
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-700">
            {formatINR(highestPrice)}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Recorded Peak</span>
        </div>

        {/* Current Price */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 tracking-wider">
            Current Price
          </span>
          <p className="text-base sm:text-lg font-black text-slate-900">
            {formatINR(currentPrice)}
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Today's Lowest</span>
        </div>

        {/* Price Drop Percentage */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
              Price Cut
            </span>
            <ArrowDownRight className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <p className="text-base sm:text-lg font-black text-indigo-900">
            {dropPercent}% DROP
          </p>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-1">
            vs Recorded Peak
          </span>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="h-64 sm:h-72 w-full pt-4 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-xs font-semibold text-slate-600 animate-pulse">
              Updating price timeline...
            </span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `₹${val}`}
              domain={['dataMin - 500', 'dataMax + 500']}
            />
            <Tooltip
              formatter={(val, name, item) => [
                formatINR(val),
                item.payload.retailer ? `Price (${item.payload.retailer})` : 'Price',
              ]}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                color: '#fff',
                border: 'none',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="effectivePrice"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981' }}
              activeDot={{ r: 7, fill: '#059669' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
