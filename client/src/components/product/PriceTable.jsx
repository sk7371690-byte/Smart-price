import React from 'react';
import { ExternalLink, CheckCircle2, ShieldCheck, Sparkles, Truck, Tag, Award } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

export default function PriceTable({ offers = [] }) {
  if (!offers.length) {
    return (
      <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
        No active retailer offers available for this product.
      </div>
    );
  }

  // Sort offers by effective price ascending (lowest first)
  const sortedOffers = [...offers].sort((a, b) => a.effectivePrice - b.effectivePrice);
  const lowestOffer = sortedOffers[0];
  const highestOffer = sortedOffers[sortedOffers.length - 1];
  const maxSavings = highestOffer.effectivePrice - lowestOffer.effectivePrice;

  return (
    <div className="space-y-6">
      {/* Lowest Price Highlight Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-emerald-700/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Award className="h-7 w-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Best Value Deal
              </span>
              {maxSavings > 0 && (
                <span className="text-xs font-bold text-emerald-100">
                  Save up to {formatINR(maxSavings)} vs other stores!
                </span>
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-0.5 flex items-baseline space-x-2">
              <span>Lowest Price: {formatINR(lowestOffer.effectivePrice)}</span>
              <span className="text-sm font-semibold text-emerald-100">
                — {lowestOffer.retailer?.name || lowestOffer.retailer || 'Best Store'}
              </span>
            </div>
          </div>
        </div>

        <a
          href={lowestOffer.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white hover:bg-slate-50 text-emerald-800 font-extrabold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-sm"
        >
          <span>View Deal on {lowestOffer.retailer?.name || lowestOffer.retailer || 'Store'}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Live Multi-Store Price Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Effective Price = Product Price + Delivery Charges − Known Discounts
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-center">
            {sortedOffers.length} Verified Stores
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs text-slate-500 uppercase font-semibold">
                <th className="py-3.5 px-4 sm:px-6">Store</th>
                <th className="py-3.5 px-4">Listed Price</th>
                <th className="py-3.5 px-4">Delivery</th>
                <th className="py-3.5 px-4">Discounts</th>
                <th className="py-3.5 px-4 font-bold text-slate-800">Effective Price</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedOffers.map((offer, idx) => {
                const isLowest = idx === 0;
                const retailerName = offer.retailer?.name || offer.retailer || 'Retailer';
                const retailerLogo = offer.retailer?.logoUrl || offer.logo || 'https://img.icons8.com/color/48/shopping-cart.png';

                return (
                  <tr
                    key={offer._id || offer.retailerSlug || retailerName}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isLowest ? 'bg-emerald-50/30 font-medium' : ''
                    }`}
                  >
                    {/* Store Name & Logo */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={retailerLogo}
                          alt={retailerName}
                          className="h-7 w-7 object-contain rounded p-0.5 bg-white border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{retailerName}</span>
                            {isLowest && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                                Lowest
                              </span>
                            )}
                          </div>
                          {offer.seller && (
                            <span className="text-[11px] text-slate-400 block">
                              Seller: {offer.seller}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Listed Price */}
                    <td className="py-4 px-4 text-slate-700">
                      <div>
                        <span className="font-semibold">{formatINR(offer.price)}</span>
                        {offer.mrp > offer.price && (
                          <span className="text-xs text-slate-400 line-through block">
                            {formatINR(offer.mrp)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Delivery Charge */}
                    <td className="py-4 px-4 text-slate-600">
                      {offer.deliveryCharge === 0 ? (
                        <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                          <Truck className="h-3.5 w-3.5" />
                          <span>FREE</span>
                        </span>
                      ) : (
                        <span className="font-medium">{formatINR(offer.deliveryCharge)}</span>
                      )}
                    </td>

                    {/* Discounts */}
                    <td className="py-4 px-4">
                      {offer.discount > 0 ? (
                        <span className="text-emerald-600 font-semibold flex items-center space-x-1 text-xs">
                          <Tag className="h-3.5 w-3.5" />
                          <span>-{formatINR(offer.discount)}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Effective Price */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-base font-extrabold ${
                          isLowest ? 'text-emerald-700 text-lg' : 'text-slate-900'
                        }`}
                      >
                        {formatINR(offer.effectivePrice)}
                      </span>
                    </td>

                    {/* Availability */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                            offer.availability === 'In Stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {offer.availability}
                        </span>
                        {offer.deliveryTime && (
                          <span className="text-[11px] text-slate-500 block">
                            {offer.deliveryTime}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Buy Now / View Deal */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <a
                        href={offer.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          isLowest
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>Buy Now</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
