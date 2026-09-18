/**
 * BaseProvider (Abstract Interface)
 * All retailer providers (Mock or Official Affiliate APIs) must extend this class
 * and implement its standard contract methods.
 */
class BaseProvider {
  constructor(name, slug, logoUrl, websiteUrl) {
    if (this.constructor === BaseProvider) {
      throw new Error("Abstract class 'BaseProvider' cannot be instantiated directly.");
    }
    this.name = name;
    this.slug = slug;
    this.logoUrl = logoUrl;
    this.websiteUrl = websiteUrl;
  }

  /**
   * Search retailer catalog by text query
   * @param {string} query 
   * @returns {Promise<Array>} Normalized product listings
   */
  async searchProducts(query) {
    throw new Error(`searchProducts() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Get single product listing by retailer SKU / ASIN / ID
   * @param {string} retailerProductId 
   * @returns {Promise<Object>} Normalized product listing
   */
  async getProduct(retailerProductId) {
    throw new Error(`getProduct() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Get current price & delivery charges
   * @param {string} retailerProductId 
   * @returns {Promise<Object>} { price, mrp, deliveryCharge, discount, effectivePrice }
   */
  async getPrice(retailerProductId) {
    throw new Error(`getPrice() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Get current stock status
   * @param {string} retailerProductId 
   * @returns {Promise<string>} 'In Stock' | 'Out of Stock' | 'Limited Stock'
   */
  async getAvailability(retailerProductId) {
    throw new Error(`getAvailability() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Normalize raw retailer payload into SmartPrice Unified Offer Schema
   * @param {Object} raw 
   * @returns {Object} Unified Offer Schema
   */
  normalizeProduct(raw) {
    throw new Error(`normalizeProduct() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Effective Price Formula:
   * Effective Price = Product Price + Delivery Charges − Known Discounts
   */
  calculateEffectivePrice(price, deliveryCharge = 0, discount = 0) {
    const p = Number(price) || 0;
    const del = Number(deliveryCharge) || 0;
    const disc = Number(discount) || 0;
    return Math.max(0, p + del - disc);
  }

  /**
   * Tokenized fuzzy keyword matcher
   */
  matchesQuery(text, query) {
    if (!query || !query.trim()) return true;
    if (!text) return false;
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const target = text.toLowerCase();
    return tokens.every((token) => target.includes(token));
  }
}

module.exports = BaseProvider;
