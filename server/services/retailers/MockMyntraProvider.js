const BaseProvider = require('./BaseProvider');

class MockMyntraProvider extends BaseProvider {
  constructor() {
    super(
      'Myntra',
      'myntra',
      'https://img.icons8.com/color/48/myntra.png',
      'https://www.myntra.com'
    );

    // Myntra specializes in Footwear, Fashion & Apparel
    this.catalog = [
      {
        styleId: 'MYN-NIKE-270-RD',
        articleTitle: 'Nike Men Black AIR MAX 270 Running Shoes',
        brand: 'Nike',
        model: 'Air Max 270',
        category: 'Footwear',
        discountedPrice: 5099,
        originalPrice: 6999,
        courierCharge: 0,
        couponSavings: 0,
        stockLevel: 'In Stock',
        estimatedArrival: 'Tomorrow by 7 PM',
        registeredSeller: 'Nike India Official Flagship',
        landingUrl: 'https://www.myntra.com/item/nike-air-max-270',
        userScore: 4.6,
        totalVotes: 2310,
        photo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        meta: { Size: 'UK 9', Color: 'Black & Red', Fastening: 'Lace-Up' },
      },
    ];
  }

  async searchProducts(query) {
    if (!query) return this.catalog.map((i) => this.normalizeProduct(i));
    const matches = this.catalog.filter((item) =>
      this.matchesQuery(`${item.brand} ${item.model} ${item.articleTitle}`, query)
    );
    return matches.map((item) => this.normalizeProduct(item));
  }

  async getProduct(retailerProductId) {
    const item = this.catalog.find((i) => i.styleId === retailerProductId);
    return item ? this.normalizeProduct(item) : null;
  }

  async getPrice(retailerProductId) {
    const item = this.catalog.find((i) => i.styleId === retailerProductId);
    if (!item) return null;
    const effectivePrice = this.calculateEffectivePrice(
      item.discountedPrice,
      item.courierCharge,
      item.couponSavings
    );
    return {
      price: item.discountedPrice,
      mrp: item.originalPrice,
      deliveryCharge: item.courierCharge,
      discount: item.couponSavings,
      effectivePrice,
    };
  }

  async getAvailability(retailerProductId) {
    const item = this.catalog.find((i) => i.styleId === retailerProductId);
    return item ? item.stockLevel : 'Out of Stock';
  }

  normalizeProduct(raw) {
    const effectivePrice = this.calculateEffectivePrice(
      raw.discountedPrice,
      raw.courierCharge,
      raw.couponSavings
    );

    return {
      retailer: this.name,
      retailerSlug: this.slug,
      retailerLogo: this.logoUrl,
      retailerProductId: raw.styleId,
      title: raw.articleTitle,
      brand: raw.brand,
      model: raw.model,
      category: raw.category,
      price: raw.discountedPrice,
      mrp: raw.originalPrice,
      deliveryCharge: raw.courierCharge,
      discount: raw.couponSavings,
      effectivePrice,
      availability: raw.stockLevel,
      deliveryTime: raw.estimatedArrival,
      seller: raw.registeredSeller,
      productUrl: raw.landingUrl,
      imageUrl: raw.photo,
      attributes: raw.meta,
      lastCheckedAt: new Date().toISOString(),
    };
  }
}

module.exports = MockMyntraProvider;
