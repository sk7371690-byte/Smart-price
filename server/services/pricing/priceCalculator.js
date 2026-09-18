/**
 * Price Calculator Engine
 * Strict calculation rules:
 * Effective Price = Product Price + Delivery Charges − Known Discounts
 * Only uses verified available numbers. Never invents prices or discounts.
 */

class PriceCalculator {
  /**
   * Compute effective price for a single retailer offer
   */
  computeEffectivePrice({ price, deliveryCharge = 0, discount = 0 }) {
    const basePrice = Number(price) || 0;
    const delivery = Number(deliveryCharge) || 0;
    const disc = Number(discount) || 0;

    const effective = basePrice + delivery - disc;
    return Math.max(0, Math.round(effective));
  }

  /**
   * Calculate discount percentage from MRP
   */
  computeDiscountPercentage(mrp, effectivePrice) {
    const original = Number(mrp) || 0;
    const current = Number(effectivePrice) || 0;
    if (original <= current || original === 0) return 0;
    return Math.round(((original - current) / original) * 100);
  }

  /**
   * Compare multiple retailer offers and generate competitive intelligence
   * @param {Array} rawOffers Array of retailer offer objects
   * @returns {Object} Structured comparison analysis
   */
  compareOffers(rawOffers = []) {
    if (!Array.isArray(rawOffers) || rawOffers.length === 0) {
      return {
        totalStoresCompared: 0,
        lowestOffer: null,
        highestOffer: null,
        maxSavings: 0,
        savingsPercent: 0,
        averagePrice: 0,
        priceSpread: 0,
        rankedOffers: [],
        formula: 'Effective Price = Product Price + Delivery Charges − Known Discounts',
      };
    }

    // Standardize and calculate effective price for each offer
    const computedOffers = rawOffers.map((offer) => {
      const price = Number(offer.price) || 0;
      const deliveryCharge = Number(offer.deliveryCharge) || 0;
      const discount = Number(offer.discount) || 0;
      const mrp = Number(offer.mrp) || price;

      const effectivePrice = this.computeEffectivePrice({
        price,
        deliveryCharge,
        discount,
      });

      const discountPercent = this.computeDiscountPercentage(mrp, effectivePrice);

      const retailerName = offer.retailer?.name || offer.retailerName || offer.retailer || 'Store';
      const retailerLogo = offer.retailer?.logoUrl || offer.retailerLogo || offer.logo || 'https://img.icons8.com/color/48/shopping-cart.png';

      return {
        ...offer,
        retailerName,
        retailerLogo,
        price,
        mrp,
        deliveryCharge,
        discount,
        effectivePrice,
        discountPercent,
        availability: offer.availability || 'In Stock',
        productUrl: offer.productUrl || '#',
        seller: offer.seller || 'Official Merchant',
        deliveryTime: offer.deliveryTime || 'Standard Shipping',
        lastCheckedAt: offer.lastCheckedAt || new Date().toISOString(),
      };
    });

    // Sort offers ascending by effective price (lowest price is index 0)
    computedOffers.sort((a, b) => a.effectivePrice - b.effectivePrice);

    // Identify winners and benchmarks
    const lowestOffer = computedOffers[0];
    const highestOffer = computedOffers[computedOffers.length - 1];

    const maxSavings = Math.max(0, highestOffer.effectivePrice - lowestOffer.effectivePrice);
    const savingsPercent = highestOffer.effectivePrice > 0
      ? Math.round((maxSavings / highestOffer.effectivePrice) * 100)
      : 0;

    const sumPrices = computedOffers.reduce((sum, off) => sum + off.effectivePrice, 0);
    const averagePrice = Math.round(sumPrices / computedOffers.length);
    const priceSpread = highestOffer.effectivePrice - lowestOffer.effectivePrice;

    // Attach rank and savings compared to lowest price
    const rankedOffers = computedOffers.map((offer, index) => {
      const extraCost = offer.effectivePrice - lowestOffer.effectivePrice;
      return {
        rank: index + 1,
        isLowest: index === 0,
        extraCostVsLowest: extraCost,
        ...offer,
      };
    });

    return {
      totalStoresCompared: rankedOffers.length,
      lowestOffer: rankedOffers[0],
      highestOffer,
      maxSavings,
      savingsPercent,
      averagePrice,
      priceSpread,
      rankedOffers,
      formula: 'Effective Price = Product Price + Delivery Charges − Known Discounts',
    };
  }
}

module.exports = new PriceCalculator();
