/**
 * AI Buying Recommendation & Deal Score Engine
 * Computes an algorithmic deal quality score (0-100), buying advice verdict,
 * and contextual natural language rationale using price history and multi-retailer spreads.
 */

/**
 * Calculates Deal Score (0 to 100)
 * Weights:
 * - 40%: Historical price performance (vs 90-day average and all-time low)
 * - 30%: Multi-retailer price spread (arbitrage vs runner-up store)
 * - 20%: Customer rating & feedback
 * - 10%: Delivery charge & fulfillment
 */
function calculateDealScore({
  currentEffectivePrice,
  allTimeLow,
  averagePrice,
  highestPrice,
  runnerUpPrice,
  rating = 4.2,
  deliveryCharge = 0,
}) {
  let histScore = 50;
  if (averagePrice && currentEffectivePrice) {
    if (currentEffectivePrice <= allTimeLow * 1.01) {
      // At or below historical all-time low! Perfect 100
      histScore = 100;
    } else if (currentEffectivePrice < averagePrice) {
      // Better than average: score scales between 65 and 95
      const savingsRatio = (averagePrice - currentEffectivePrice) / averagePrice;
      histScore = Math.min(95, Math.round(65 + savingsRatio * 150));
    } else if (currentEffectivePrice === averagePrice) {
      histScore = 50;
    } else {
      // Higher than average: penalty
      const markupRatio = (currentEffectivePrice - averagePrice) / averagePrice;
      histScore = Math.max(10, Math.round(50 - markupRatio * 100));
    }
  }

  // Spread score (Arbitrage vs other retailers)
  let spreadScore = 50;
  if (runnerUpPrice && runnerUpPrice > currentEffectivePrice) {
    const spreadPct = ((runnerUpPrice - currentEffectivePrice) / runnerUpPrice) * 100;
    if (spreadPct >= 15) spreadScore = 100;
    else if (spreadPct >= 10) spreadScore = 88;
    else if (spreadPct >= 5) spreadScore = 75;
    else spreadScore = 60;
  } else if (!runnerUpPrice) {
    spreadScore = 55;
  }

  // Rating score (0 to 100)
  const normalizedRating = Math.max(1, Math.min(5, Number(rating) || 4.0));
  const ratingScore = Math.round((normalizedRating / 5.0) * 100);

  // Delivery / fulfillment score
  const fulfillmentScore = deliveryCharge === 0 ? 100 : Math.max(40, 100 - deliveryCharge);

  // Composite Weighted Calculation
  const finalScore = Math.round(
    histScore * 0.40 +
    spreadScore * 0.30 +
    ratingScore * 0.20 +
    fulfillmentScore * 0.10
  );

  return {
    finalScore: Math.min(99, Math.max(15, finalScore)),
    subScores: {
      historical: histScore,
      retailerSpread: spreadScore,
      rating: ratingScore,
      fulfillment: fulfillmentScore,
    }
  };
}

/**
 * Derives verdict recommendation, badge color, and actionable advice
 */
function getVerdict(dealScore) {
  if (dealScore >= 80) {
    return {
      status: 'STRONG_BUY',
      label: 'Strong Buy — All-Time Low Deal',
      color: 'emerald',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      shortAdvice: 'Price is at or near its lowest recorded point. Outstanding time to buy.',
    };
  }
  if (dealScore >= 65) {
    return {
      status: 'GOOD_DEAL',
      label: 'Good Deal — Below Average',
      color: 'blue',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      shortAdvice: 'Priced comfortably below average with solid multi-retailer savings.',
    };
  }
  if (dealScore >= 45) {
    return {
      status: 'FAIR_PRICE',
      label: 'Fair Price — Steady Baseline',
      color: 'amber',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      shortAdvice: 'Standard pricing without aggressive promotional discounts. Buy if urgently needed.',
    };
  }
  return {
    status: 'WAIT_FOR_SALE',
    label: 'Wait for Sale — Price Inflated',
    color: 'rose',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    shortAdvice: 'Current price is higher than historical trend. We advise setting a price drop alert.',
  };
}

/**
 * Synthesizes a human-like AI analytical rationale
 */
function generateRationale({
  productTitle,
  bestRetailer,
  bestPrice,
  runnerUpRetailer,
  runnerUpPrice,
  averagePrice,
  allTimeLow,
  verdict,
  deliveryCharge,
}) {
  const currencyFormatter = (val) => `₹${Math.round(val).toLocaleString('en-IN')}`;
  const paragraphs = [];

  // Retailer comparison highlight
  if (runnerUpPrice && runnerUpPrice > bestPrice) {
    const savings = runnerUpPrice - bestPrice;
    paragraphs.push(
      `**${bestRetailer}** currently offers the best deal at **${currencyFormatter(bestPrice)}**, saving you **${currencyFormatter(savings)}** compared to ${runnerUpRetailer} (${currencyFormatter(runnerUpPrice)}).`
    );
  } else {
    paragraphs.push(
      `**${bestRetailer}** has the lowest current price at **${currencyFormatter(bestPrice)}**${deliveryCharge === 0 ? ' with free delivery' : ''}.`
    );
  }

  // Trend and historical insight
  if (averagePrice) {
    const diff = averagePrice - bestPrice;
    if (diff > 0) {
      const pct = Math.round((diff / averagePrice) * 100);
      paragraphs.push(
        `This price is **${pct}% lower** than the 90-day average benchmark (${currencyFormatter(averagePrice)}).`
      );
    } else if (diff < 0) {
      const pct = Math.round((Math.abs(diff) / averagePrice) * 100);
      paragraphs.push(
        `Note: This is currently **${pct}% higher** than the regular 90-day average (${currencyFormatter(averagePrice)}).`
      );
    }
  }

  if (allTimeLow && bestPrice <= allTimeLow * 1.02) {
    paragraphs.push(`🎯 This is matching the all-time historic low of **${currencyFormatter(allTimeLow)}**.`);
  }

  // Closing suggestion
  if (verdict.status === 'WAIT_FOR_SALE') {
    const suggestedTarget = Math.round(bestPrice * 0.90);
    paragraphs.push(
      `💡 **Recommendation:** Set an automated Price Alert at **${currencyFormatter(suggestedTarget)}** to be notified the second a seasonal price drop or flash coupon occurs.`
    );
  } else if (verdict.status === 'STRONG_BUY') {
    paragraphs.push(
      `⚡ **Smart Advice:** Inventory at this price level typically sells fast. Recommended to proceed with checkout.`
    );
  }

  return paragraphs.join(' ');
}

/**
 * Generate full recommendation payload for a product comparison
 */
function analyzeProductDeal({ product, offers = [], priceHistory = [] }) {
  if (!product) {
    return null;
  }

  // Sort offers by effectivePrice
  const sortedOffers = [...offers].sort((a, b) => a.effectivePrice - b.effectivePrice);
  const bestOffer = sortedOffers[0] || product.lowestOffer || {
    retailerName: 'Amazon India',
    effectivePrice: product.priceStats?.lowest || 49999,
    deliveryCharge: 0,
  };
  const runnerUpOffer = sortedOffers[1] || null;

  // History stats
  let allTimeLow = product.priceStats?.lowest || bestOffer.effectivePrice;
  let averagePrice = product.priceStats?.average || Math.round(bestOffer.effectivePrice * 1.08);
  let highestPrice = product.priceStats?.highest || Math.round(bestOffer.effectivePrice * 1.25);

  if (priceHistory && priceHistory.length > 0) {
    const prices = priceHistory.map((h) => h.effectivePrice || h.price).filter(Boolean);
    if (prices.length > 0) {
      allTimeLow = Math.min(...prices);
      highestPrice = Math.max(...prices);
      averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    }
  }

  const { finalScore, subScores } = calculateDealScore({
    currentEffectivePrice: bestOffer.effectivePrice,
    allTimeLow,
    averagePrice,
    highestPrice,
    runnerUpPrice: runnerUpOffer?.effectivePrice,
    rating: product.rating || 4.3,
    deliveryCharge: bestOffer.deliveryCharge || 0,
  });

  const verdict = getVerdict(finalScore);

  const rationale = generateRationale({
    productTitle: product.title,
    bestRetailer: bestOffer.retailerName,
    bestPrice: bestOffer.effectivePrice,
    runnerUpRetailer: runnerUpOffer?.retailerName,
    runnerUpPrice: runnerUpOffer?.effectivePrice,
    averagePrice,
    allTimeLow,
    verdict,
    deliveryCharge: bestOffer.deliveryCharge || 0,
  });

  // Recommended target price for alert (8-12% drop)
  const suggestedAlertPrice = Math.round(bestOffer.effectivePrice * 0.90);

  return {
    dealScore: finalScore,
    subScores,
    verdict,
    rationale,
    suggestedAlertPrice,
    metrics: {
      bestPrice: bestOffer.effectivePrice,
      bestRetailer: bestOffer.retailerName,
      runnerUpPrice: runnerUpOffer?.effectivePrice || null,
      potentialSavings: runnerUpOffer ? runnerUpOffer.effectivePrice - bestOffer.effectivePrice : 0,
      allTimeLow,
      averagePrice,
      highestPrice,
      discountVsAverage: averagePrice ? Math.round(((averagePrice - bestOffer.effectivePrice) / averagePrice) * 100) : 0,
    }
  };
}

module.exports = {
  calculateDealScore,
  getVerdict,
  generateRationale,
  analyzeProductDeal,
};
