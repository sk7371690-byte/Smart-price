const BaseProvider = require('./BaseProvider');

class MockCromaProvider extends BaseProvider {
  constructor() {
    super(
      'Tata Croma',
      'croma',
      'https://img.icons8.com/color/48/shopping-cart.png',
      'https://www.croma.com'
    );

    this.catalog = [
      {
        skuCode: 'CRM-NIKE-270',
        webTitle: 'Nike Air Max 270 Men Casual Running Shoes - Red/Black',
        brand: 'Nike',
        model: 'Air Max 270',
        category: 'Footwear',
        onlinePrice: 5399,
        printedMrp: 6999,
        shippingFee: 0,
        promoDiscount: 0,
        stockState: 'Limited Stock',
        leadTime: 'Express Delivery in 3-4 Business Days',
        storePartner: 'Tata Croma Retail Lifestyle',
        webUrl: 'https://www.croma.com/p/nike-air-max-270',
        custRating: 4.5,
        ratingCount: 380,
        mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        properties: { Size: 'UK 9', Color: 'Black/Red', Warranty: '6 Months' },
      },
      {
        skuCode: 'CRM-SAMS-S24',
        webTitle: 'Samsung Galaxy S24 5G (8GB RAM, 256GB, Onyx Black)',
        brand: 'Samsung',
        model: 'Galaxy S24',
        category: 'Mobiles',
        onlinePrice: 75990,
        printedMrp: 84999,
        shippingFee: 0,
        promoDiscount: 1000,
        stockState: 'In Stock',
        leadTime: 'Free Delivery or Pickup at nearest Croma in 2 hrs',
        storePartner: 'Croma Electronics Megastore',
        webUrl: 'https://www.croma.com/p/samsung-galaxy-s24',
        custRating: 4.8,
        ratingCount: 1890,
        mainImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
        properties: { RAM: '8 GB', Storage: '256 GB', Color: 'Onyx Black' },
      },
      {
        skuCode: 'CRM-SONY-XM5',
        webTitle: 'Sony WH-1000XM5 Over-Ear Noise Cancelling Wireless Headphones (Silver)',
        brand: 'Sony',
        model: 'WH-1000XM5',
        category: 'Audio',
        onlinePrice: 26990,
        printedMrp: 34990,
        shippingFee: 0,
        promoDiscount: 1000,
        stockState: 'In Stock',
        leadTime: 'Free Express Delivery by Friday',
        storePartner: 'Croma Audio Hub Official',
        webUrl: 'https://www.croma.com/p/sony-wh1000xm5',
        custRating: 4.9,
        ratingCount: 1240,
        mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        properties: { Color: 'Silver', NoiseCancellation: 'Active Dual-Chip' },
      },
      {
        skuCode: 'CRM-APPL-M2',
        webTitle: 'Apple MacBook Air 2022 (M2, 13.6 Inch, 8GB, 256GB, Midnight)',
        brand: 'Apple',
        model: 'MacBook Air M2',
        category: 'Laptops',
        onlinePrice: 86900,
        printedMrp: 99900,
        shippingFee: 0,
        promoDiscount: 2000,
        stockState: 'In Stock',
        leadTime: 'Free Express Delivery with 1 Year Official Apple Warranty',
        storePartner: 'Tata Croma Apple Authorized Reseller',
        webUrl: 'https://www.croma.com/p/apple-macbook-air-m2',
        custRating: 4.9,
        ratingCount: 3490,
        mainImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        properties: { Chip: 'Apple M2', RAM: '8 GB', Storage: '256 GB' },
      },
    ];
  }

  async searchProducts(query) {
    if (!query) return this.catalog.map((i) => this.normalizeProduct(i));
    const matches = this.catalog.filter((item) =>
      this.matchesQuery(`${item.brand} ${item.model} ${item.webTitle}`, query)
    );
    return matches.map((item) => this.normalizeProduct(item));
  }

  async getProduct(retailerProductId) {
    const item = this.catalog.find((i) => i.skuCode === retailerProductId);
    return item ? this.normalizeProduct(item) : null;
  }

  async getPrice(retailerProductId) {
    const item = this.catalog.find((i) => i.skuCode === retailerProductId);
    if (!item) return null;
    const effectivePrice = this.calculateEffectivePrice(
      item.onlinePrice,
      item.shippingFee,
      item.promoDiscount
    );
    return {
      price: item.onlinePrice,
      mrp: item.printedMrp,
      deliveryCharge: item.shippingFee,
      discount: item.promoDiscount,
      effectivePrice,
    };
  }

  async getAvailability(retailerProductId) {
    const item = this.catalog.find((i) => i.skuCode === retailerProductId);
    return item ? item.stockState : 'Out of Stock';
  }

  normalizeProduct(raw) {
    const effectivePrice = this.calculateEffectivePrice(
      raw.onlinePrice,
      raw.shippingFee,
      raw.promoDiscount
    );

    return {
      retailer: this.name,
      retailerSlug: this.slug,
      retailerLogo: this.logoUrl,
      retailerProductId: raw.skuCode,
      title: raw.webTitle,
      brand: raw.brand,
      model: raw.model,
      category: raw.category,
      price: raw.onlinePrice,
      mrp: raw.printedMrp,
      deliveryCharge: raw.shippingFee,
      discount: raw.promoDiscount,
      effectivePrice,
      availability: raw.stockState,
      deliveryTime: raw.leadTime,
      seller: raw.storePartner,
      productUrl: raw.webUrl,
      imageUrl: raw.mainImage,
      attributes: raw.properties,
      lastCheckedAt: new Date().toISOString(),
    };
  }
}

module.exports = MockCromaProvider;
