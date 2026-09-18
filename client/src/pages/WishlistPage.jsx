import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, ExternalLink, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getWishlistApi, removeFromWishlistApi } from '../services/userFeaturesApi';
import { formatINR } from '../utils/formatCurrency';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await getWishlistApi();
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn('[WishlistPage] Error loading wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlistApi(productId);
      setItems((prev) => prev.filter((item) => (item.product?._id || item.product?.id || item.product) !== productId));
    } catch (err) {
      console.error('[WishlistPage] Remove error:', err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Heart className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your Wishlist is Waiting</h2>
        <p className="text-sm text-slate-500">
          Sign in to view and manage your saved products and track multi-store price drops.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all"
        >
          <span>Sign In to View Wishlist</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingState message="Loading your saved wishlist items..." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Your Wishlist is Empty"
          description="You have not saved any products yet. Browse our catalog and tap the heart icon on any product to monitor its price."
          actionText="Explore Top Deals"
          actionLink="/search"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-3">
            <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
            <span>My Saved Wishlist</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking {items.length} product{items.length === 1 ? '' : 's'} across Amazon, Flipkart, Myntra, and Croma
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const product = item.product || {};
          const productId = product._id || product.id;
          const lowestPrice = product.lowestOffer?.effectivePrice || item.addedPrice || 4899;
          const storeName = product.lowestOffer?.retailerName || 'Flipkart';

          return (
            <div
              key={item._id || productId}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex space-x-4">
                <img
                  src={product.thumbnailUrl || product.thumbnail || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'}
                  alt={product.title}
                  className="h-24 w-24 object-cover rounded-xl bg-slate-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    {product.brand || 'Brand'}
                  </span>
                  <Link to={`/product/${productId}`}>
                    <h3 className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                      {product.title || 'Product Title'}
                    </h3>
                  </Link>
                  <div className="mt-2">
                    <span className="text-xs text-slate-400 block font-medium">Lowest Price:</span>
                    <span className="text-lg font-black text-slate-900">
                      {formatINR(lowestPrice)}
                    </span>
                    <span className="ml-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      on {storeName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleRemove(productId)}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center space-x-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>

                <Link
                  to={`/product/${productId}`}
                  className="inline-flex items-center space-x-1 px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  <span>Compare Deals</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
