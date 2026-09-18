const BaseProvider = require('./BaseProvider');

class MockAmazonProvider extends BaseProvider {
  constructor() {
    super(
      'Amazon India',
      'amazon',
      'https://img.icons8.com/color/48/amazon.png',
      'https://www.amazon.in'
    );

    // Mock Amazon product catalog with ASINs
    this.catalog = [
      {
        asin: 'B07T9W7WKN',
        rawTitle: 'Nike Men\'s Air Max 270 Running Shoe (Black/Red, 9 UK)',
        brand: 'Nike',
        model: 'Air Max 270',
        category: 'Footwear',
        price: 5249,
        mrp: 6999,
        deliveryFee: 50,
        couponDiscount: 0,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Guaranteed Tomorrow by Amazon Prime',
        merchantName: 'Appario Retail Private Ltd',
        pageUrl: 'https://www.amazon.in/dp/B07T9W7WKN',
        ratingScore: 4.6,
        reviews: 3200,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        specs: { Size: 'UK 9', Color: 'Black/Red', Material: 'Mesh' },
      },
      {
        asin: 'B0CQ2W518B',
        rawTitle: 'Samsung Galaxy S24 5G AI Smartphone (Onyx Black, 8GB, 256GB Storage)',
        brand: 'Samsung',
        model: 'Galaxy S24',
        category: 'Mobiles',
        price: 74999,
        mrp: 84999,
        deliveryFee: 0,
        couponDiscount: 2000,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Tomorrow by 11 AM with Prime',
        merchantName: 'STPL Exclusive India',
        pageUrl: 'https://www.amazon.in/dp/B0CQ2W518B',
        ratingScore: 4.7,
        reviews: 4120,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
        specs: { RAM: '8 GB', Storage: '256 GB', Color: 'Onyx Black' },
      },
      {
        asin: 'B09XS7JWHH',
        rawTitle: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones (Silver)',
        brand: 'Sony',
        model: 'WH-1000XM5',
        category: 'Audio',
        price: 26990,
        mrp: 34990,
        deliveryFee: 0,
        couponDiscount: 0,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Next Day Prime Delivery',
        merchantName: 'Appario Electronics',
        pageUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
        ratingScore: 4.8,
        reviews: 1980,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        specs: { Color: 'Silver', Connectivity: 'Bluetooth 5.2' },
      },
      {
        asin: 'B0B3C5B52Q',
        rawTitle: 'Apple 2022 MacBook Air Laptop with M2 chip: 13.6-inch Liquid Retina Display, 8GB RAM, 256GB SSD',
        brand: 'Apple',
        model: 'MacBook Air M2',
        category: 'Laptops',
        price: 84990,
        mrp: 99900,
        deliveryFee: 0,
        couponDiscount: 1000,
        stockStatus: 'In Stock',
        deliveryEstimate: 'Same-Day Prime Express Delivery',
        merchantName: 'Amazon Prime Verified Apple Store',
        pageUrl: 'https://www.amazon.in/dp/B0B3C5B52Q',
        ratingScore: 4.9,
        reviews: 6420,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        specs: { Chip: 'Apple M2', RAM: '8 GB', Storage: '256 GB' },
      },
    ];
  }

  async searchProducts(query) {
    if (!query) return this.catalog.map((i) => this.normalizeProduct(i));
    const matches = this.catalog.filter((item) =>
      this.matchesQuery(`${item.brand} ${item.model} ${item.rawTitle}`, query)
    );
    return matches.map((item) => this.normalizeProduct(item));
  }

  async getProduct(retailerProductId) {
    const item = this.catalog.find((i) => i.asin === retailerProductId);
    return item ? this.normalizeProduct(item) : null;
  }

  async getPrice(retailerProductId) {
    const item = this.catalog.find((i) => i.asin === retailerProductId);
    if (!item) return null;
    const effectivePrice = this.calculateEffectivePrice(
      item.price,
      item.deliveryFee,
      item.couponDiscount
    );
    return {
      price: item.price,
      mrp: item.mrp,
      deliveryCharge: item.deliveryFee,
      discount: item.couponDiscount,
      effectivePrice,
    };
  }

  async getAvailability(retailerProductId) {
    const item = this.catalog.find((i) => i.asin === retailerProductId);
    return item ? item.stockStatus : 'Out of Stock';
  }

  normalizeProduct(raw) {
    const effectivePrice = this.calculateEffectivePrice(
      raw.price,
      raw.deliveryFee,
      raw.couponDiscount
    );

    return {
      retailer: this.name,
      retailerSlug: this.slug,
      retailerLogo: this.logoUrl,
      retailerProductId: raw.asin,
      title: raw.rawTitle,
      brand: raw.brand,
      model: raw.model,
      category: raw.category,
      price: raw.price,
      mrp: raw.mrp,
      deliveryCharge: raw.deliveryFee,
      discount: raw.couponDiscount,
      effectivePrice,
      availability: raw.stockStatus,
      deliveryTime: raw.deliveryEstimate,
      seller: raw.merchantName,
      productUrl: raw.pageUrl,
      imageUrl: raw.image,
      attributes: raw.specs,
      lastCheckedAt: new Date().toISOString(),
    };
  }
}

module.exports = MockAmazonProvider;
