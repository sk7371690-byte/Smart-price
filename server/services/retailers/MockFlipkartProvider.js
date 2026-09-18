const BaseProvider = require('./BaseProvider');

class MockFlipkartProvider extends BaseProvider {
  constructor() {
    super(
      'Flipkart',
      'flipkart',
      'https://img.icons8.com/color/48/flipkart.png',
      'https://www.flipkart.com'
    );

    this.catalog = [
      {
        fsn: 'SHOE-NIKE-270',
        productName: 'Nike Air Max 270 Sneakers For Men (Black)',
        brand: 'Nike',
        model: 'Air Max 270',
        category: 'Footwear',
        listingPrice: 4899,
        maxRetailPrice: 6999,
        shippingCost: 0,
        offerDiscount: 0,
        inventoryStatus: 'In Stock',
        shippingTimeline: 'Free delivery by Tomorrow, 2 PM',
        vendor: 'RetailNet Authentic Assured',
        targetUrl: 'https://www.flipkart.com/item/nike-air-max-270',
        rating: 4.5,
        ratingCount: 5120,
        img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        specs: { Size: 'UK 9', Color: 'Black/Red', Closure: 'Lace-Up' },
      },
      {
        fsn: 'MOB-SAMS-S24',
        productName: 'SAMSUNG Galaxy S24 5G (Onyx Black, 256 GB, 8 GB RAM)',
        brand: 'Samsung',
        model: 'Galaxy S24',
        category: 'Mobiles',
        listingPrice: 74999,
        maxRetailPrice: 84999,
        shippingCost: 99,
        offerDiscount: 1500,
        inventoryStatus: 'In Stock',
        shippingTimeline: 'Delivery in 2 Days | Flipkart Assured',
        vendor: 'OmniTech Retail',
        targetUrl: 'https://www.flipkart.com/item/samsung-galaxy-s24',
        rating: 4.7,
        ratingCount: 8930,
        img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
        specs: { RAM: '8 GB', Storage: '256 GB', Color: 'Onyx Black' },
      },
      {
        fsn: 'HEAD-SONY-XM5',
        productName: 'SONY WH-1000XM5 Bluetooth Headset with Active Noise Cancellation (Silver)',
        brand: 'Sony',
        model: 'WH-1000XM5',
        category: 'Audio',
        listingPrice: 27490,
        maxRetailPrice: 34990,
        shippingCost: 50,
        offerDiscount: 0,
        inventoryStatus: 'In Stock',
        shippingTimeline: 'Delivery by Thursday',
        vendor: 'SuperComNet Assured',
        targetUrl: 'https://www.flipkart.com/item/sony-wh1000xm5',
        rating: 4.8,
        ratingCount: 1420,
        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        specs: { Color: 'Silver', Connectivity: 'Wireless' },
      },
      {
        fsn: 'LAP-APPL-M2',
        productName: 'Apple MacBook AIR Apple M2 - (8 GB/256 GB SSD/macOS Monterey) MLY33HN/A',
        brand: 'Apple',
        model: 'MacBook Air M2',
        category: 'Laptops',
        listingPrice: 84990,
        maxRetailPrice: 99900,
        shippingCost: 0,
        offerDiscount: 3000,
        inventoryStatus: 'In Stock',
        shippingTimeline: 'Tomorrow by 2 PM',
        vendor: 'IndiFlashMart Assured',
        targetUrl: 'https://www.flipkart.com/item/apple-macbook-air-m2',
        rating: 4.9,
        ratingCount: 7890,
        img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        specs: { Chip: 'Apple M2', RAM: '8 GB', Storage: '256 GB' },
      },
    ];
  }

  async searchProducts(query) {
    if (!query) return this.catalog.map((i) => this.normalizeProduct(i));
    const matches = this.catalog.filter((item) =>
      this.matchesQuery(`${item.brand} ${item.model} ${item.productName}`, query)
    );
    return matches.map((item) => this.normalizeProduct(item));
  }

  async getProduct(retailerProductId) {
    const item = this.catalog.find((i) => i.fsn === retailerProductId);
    return item ? this.normalizeProduct(item) : null;
  }

  async getPrice(retailerProductId) {
    const item = this.catalog.find((i) => i.fsn === retailerProductId);
    if (!item) return null;
    const effectivePrice = this.calculateEffectivePrice(
      item.listingPrice,
      item.shippingCost,
      item.offerDiscount
    );
    return {
      price: item.listingPrice,
      mrp: item.maxRetailPrice,
      deliveryCharge: item.shippingCost,
      discount: item.offerDiscount,
      effectivePrice,
    };
  }

  async getAvailability(retailerProductId) {
    const item = this.catalog.find((i) => i.fsn === retailerProductId);
    return item ? item.inventoryStatus : 'Out of Stock';
  }

  normalizeProduct(raw) {
    const effectivePrice = this.calculateEffectivePrice(
      raw.listingPrice,
      raw.shippingCost,
      raw.offerDiscount
    );

    return {
      retailer: this.name,
      retailerSlug: this.slug,
      retailerLogo: this.logoUrl,
      retailerProductId: raw.fsn,
      title: raw.productName,
      brand: raw.brand,
      model: raw.model,
      category: raw.category,
      price: raw.listingPrice,
      mrp: raw.maxRetailPrice,
      deliveryCharge: raw.shippingCost,
      discount: raw.offerDiscount,
      effectivePrice,
      availability: raw.inventoryStatus,
      deliveryTime: raw.shippingTimeline,
      seller: raw.vendor,
      productUrl: raw.targetUrl,
      imageUrl: raw.img,
      attributes: raw.specs,
      lastCheckedAt: new Date().toISOString(),
    };
  }
}

module.exports = MockFlipkartProvider;
