// Formatter for Indian Rupee (INR)
export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate effective price: Price + Delivery - Discount
export const calculateEffectivePrice = (price, deliveryCharge = 0, discount = 0) => {
  const effective = Number(price) + Number(deliveryCharge) - Number(discount);
  return Math.max(0, effective);
};

// Calculate discount percentage
export const calculateDiscountPercent = (mrp, currentPrice) => {
  if (!mrp || mrp <= currentPrice) return 0;
  return Math.round(((mrp - currentPrice) / mrp) * 100);
};
