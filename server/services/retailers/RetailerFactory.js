const MockAmazonProvider = require('./MockAmazonProvider');
const MockFlipkartProvider = require('./MockFlipkartProvider');
const MockMyntraProvider = require('./MockMyntraProvider');
const MockCromaProvider = require('./MockCromaProvider');

class RetailerFactory {
  constructor() {
    this.providers = new Map();

    // Register active mock retailer providers
    this.registerProvider('amazon', new MockAmazonProvider());
    this.registerProvider('flipkart', new MockFlipkartProvider());
    this.registerProvider('myntra', new MockMyntraProvider());
    this.registerProvider('croma', new MockCromaProvider());
  }

  registerProvider(slug, providerInstance) {
    this.providers.set(slug.toLowerCase(), providerInstance);
  }

  getProvider(slug) {
    return this.providers.get(slug.toLowerCase()) || null;
  }

  getAllProviders() {
    return Array.from(this.providers.values());
  }

  /**
   * Concurrently query all registered providers for product deals
   * @param {string} query 
   * @returns {Promise<Array>} Aggregated normalized offers sorted by effective price
   */
  async searchAllRetailers(query) {
    const promises = Array.from(this.providers.values()).map(async (provider) => {
      try {
        return await provider.searchProducts(query);
      } catch (err) {
        console.error(`[RetailerFactory Error] Provider ${provider.name} failed: ${err.message}`);
        return [];
      }
    });

    const results = await Promise.allSettled(promises);
    const aggregated = [];

    for (const res of results) {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        aggregated.push(...res.value);
      }
    }

    // Sort combined results by lowest effective price first
    aggregated.sort((a, b) => a.effectivePrice - b.effectivePrice);

    return aggregated;
  }

  /**
   * Find the absolute lowest price across all retailers for a specific product query
   */
  async findBestOffer(query) {
    const allOffers = await this.searchAllRetailers(query);
    const lowestOffer = allOffers.length > 0 ? allOffers[0] : null;

    return {
      query,
      lowestOffer,
      totalOffers: allOffers.length,
      offers: allOffers,
    };
  }
}

// Export singleton instance
module.exports = new RetailerFactory();
