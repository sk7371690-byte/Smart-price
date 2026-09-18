import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ArrowUpDown, Sparkles, Search } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import AiSmartSearchBar from '../components/ai/AiSmartSearchBar';
import ProductCard from '../components/product/ProductCard';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { getProducts } from '../services/productApi';
import { smartSearchApi } from '../services/aiApi';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const modeParam = searchParams.get('mode') || 'standard';

  const [searchMode, setSearchMode] = useState(modeParam);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiMetadata, setAiMetadata] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('price-asc');

  const categories = ['All', 'Mobiles', 'Laptops', 'Audio', 'Footwear'];
  const brands = ['All', 'Nike', 'Samsung', 'Apple', 'Sony'];

  // Sync category state when URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProducts({
        q: queryParam,
        category: selectedCategory,
        brand: selectedBrand,
        sortBy,
      });
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchMode === 'standard') {
      fetchProducts();
    }
  }, [queryParam, selectedCategory, selectedBrand, sortBy, searchMode]);

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };

  const handleAiSearch = async (parsedData, rawQuery) => {
    try {
      setLoading(true);
      setError(null);
      setAiMetadata(parsedData);
      const res = await smartSearchApi(rawQuery);
      if (res.success && Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (err) {
      setError(err.message || 'AI search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Mode Toggle */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => {
            setSearchMode('standard');
            setAiMetadata(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            searchMode === 'standard'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Catalog Search
        </button>
        <button
          onClick={() => setSearchMode('ai')}
          className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            searchMode === 'ai'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Natural Language Search</span>
        </button>
      </div>

      {/* Header Search Section */}
      <div className="mb-8">
        {searchMode === 'ai' ? (
          <AiSmartSearchBar onAiSearch={handleAiSearch} initialQuery={queryParam} />
        ) : (
          <SearchBar initialQuery={queryParam} onSearch={handleSearch} />
        )}
      </div>

      {/* Title & Results Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {queryParam ? `Results for "${queryParam}"` : 'All Compared Products'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Found <strong className="text-slate-800">{products.length}</strong> matching products across Amazon, Flipkart, Myntra, and Croma
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Sort by:</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="price-asc">Lowest Price First</option>
            <option value="price-desc">Highest Price First</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Filter className="h-4 w-4 text-emerald-600" />
                <span>Filters</span>
              </h2>
              {(selectedCategory !== 'All' || selectedBrand !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedBrand('All');
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Category
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Brand
              </h3>
              <div className="space-y-1.5">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      selectedBrand === b
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{b}</span>
                    {selectedBrand === b && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <LoadingState message="Querying live product prices from server..." />
          ) : error ? (
            <ErrorState title="Search Failed" message={error} onRetry={fetchProducts} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No Products Match Your Filter"
              description={`We couldn't find any products matching "${queryParam}". Try clearing your filters or exploring another category.`}
              actionText="Reset All Filters"
              actionLink="/search"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
