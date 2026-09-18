import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Heart,
  Bell,
  TrendingDown,
  ExternalLink,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatINR, calculateDiscountPercent } from '../utils/formatCurrency';
import PriceTable from '../components/product/PriceTable';
import PriceAlertModal from '../components/product/PriceAlertModal';
import PriceHistoryChart from '../components/charts/PriceHistoryChart';
import AiBuyingAdvisor from '../components/ai/AiBuyingAdvisor';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { getProductById } from '../services/productApi';
import { addToWishlistApi, removeFromWishlistApi } from '../services/userFeaturesApi';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [suggestedTargetPrice, setSuggestedTargetPrice] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlistApi(id);
        setIsWishlisted(false);
      } else {
        await addToWishlistApi(id);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.warn('[ProductDetailPage] Wishlist toggle:', err.message);
      setIsWishlisted(!isWishlisted);
    }
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProductById(id);
      if (res.success && res.data) {
        setProduct(res.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError(err.message || 'Unable to load product comparison');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <LoadingState message="Fetching live retailer offers and price history..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ErrorState title="Failed to Load Product" message={error} onRetry={fetchDetails} />
      </div>
    );
  }

  // Calculate lowest offer and pricing
  const offers = product.offers || [];
  const sortedOffers = [...offers].sort((a, b) => a.effectivePrice - b.effectivePrice);
  const lowestOffer = sortedOffers[0];
  const lowestEffectivePrice = lowestOffer?.effectivePrice || product.lowestOffer?.effectivePrice;
  const lowestRetailerName = lowestOffer?.retailer?.name || lowestOffer?.retailer || product.lowestOffer?.retailerName || 'Retailer';
  const highestMrp = lowestOffer?.mrp || product.lowestOffer?.price || lowestEffectivePrice;
  const discountPercent = calculateDiscountPercent(highestMrp, lowestEffectivePrice);

  // Price history timeline
  const historyData = product.priceHistory || [
    { date: '10 Sep', price: lowestEffectivePrice * 1.08 },
    { date: '12 Sep', price: lowestEffectivePrice * 1.05 },
    { date: '14 Sep', price: lowestEffectivePrice * 1.02 },
    { date: 'Today', price: lowestEffectivePrice },
  ];
  const prices = historyData.map((p) => p.price);
  const lowestHistoricalPrice = Math.min(...prices);
  const highestHistoricalPrice = Math.max(...prices);

  // Attributes / Specifications map
  const attributes = product.attributes instanceof Map
    ? Object.fromEntries(product.attributes)
    : product.attributes || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back Button */}
      <div>
        <Link
          to="/search"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Search Results</span>
        </Link>
      </div>

      {/* Top Section: Gallery + Product Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Image */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden text-center">
            <div className="relative pt-[90%] rounded-2xl overflow-hidden bg-slate-50 mb-4">
              <img
                src={product.thumbnailUrl || product.thumbnail}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm border border-slate-200">
                {product.category}
              </span>
              {discountPercent > 0 && (
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white shadow">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Micro-Features */}
            <div className="grid grid-cols-2 gap-3 text-left pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-700">100% Verified Stores</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2.5">
                <TrendingDown className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-700">Live Price Scans</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Best Price Callout */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating || 4.6}</span>
                </div>
                <span className="text-slate-400">({product.reviewsCount || 120} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Pricing Highlight Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  Guaranteed Lowest Effective Price
                </span>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                    {formatINR(lowestEffectivePrice)}
                  </span>
                  {highestMrp > lowestEffectivePrice && (
                    <span className="text-sm sm:text-base text-slate-400 line-through">
                      {formatINR(highestMrp)}
                    </span>
                  )}
                </div>
              </div>

              <div className="self-start sm:self-auto">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <span>Available on {lowestRetailerName}</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 border-t border-slate-800 pt-4">
              Effective Price includes delivery charges and available store coupon discounts.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {lowestOffer?.productUrl && (
                <a
                  href={lowestOffer.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center space-x-2 py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black rounded-2xl shadow-lg transition-all text-sm"
                >
                  <span>Buy Now on {lowestRetailerName}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="inline-flex items-center justify-center space-x-2 py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 transition-all text-sm"
              >
                <Bell className="h-4 w-4 text-amber-400" />
                <span>Price Drop Alert</span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                  isWishlisted
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Product Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* AI Buying Advisor & Deal Score Gauge */}
      <AiBuyingAdvisor
        product={product}
        offers={offers}
        onOpenAlertModal={(target) => {
          setSuggestedTargetPrice(target);
          setIsAlertModalOpen(true);
        }}
      />

      {/* Retailer Comparison Section */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Compare Retailer Offers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time pricing matrix across Amazon, Flipkart, Myntra, and Croma
          </p>
        </div>
        <PriceTable offers={offers} />
      </section>

      {/* Price History Section with Interactive Range Filters & Recharts */}
      <PriceHistoryChart productId={id} />

      {/* Specifications Table */}
      {Object.keys(attributes).length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Key Specifications & Attributes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(attributes).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm"
              >
                <span className="font-semibold text-slate-500">{key}</span>
                <span className="font-bold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Price Drop Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          setSuggestedTargetPrice(null);
        }}
        product={product}
        currentPrice={lowestEffectivePrice}
        initialTargetPrice={suggestedTargetPrice}
      />
    </div>
  );
}
