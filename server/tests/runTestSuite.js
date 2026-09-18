/**
 * SmartPrice Comprehensive Automated Test Suite
 * Validates Security Hardening, Authentication, Price Formulas,
 * Product Matching Gatekeeper, AI Query Parser, and Deal Score Analytics.
 */

const assert = require('assert');
const http = require('http');
const app = require('../app');
const { generateToken } = require('../config/jwt');
const priceCalculator = require('../services/pricing/priceCalculator');
const { extractAttributes } = require('../services/matching/attributeExtractor');
const productMatchingEngine = require('../services/matching/ProductMatchingEngine');
const { parseNaturalLanguageQuery } = require('../services/ai/aiQueryParser');
const { calculateDealScore, getVerdict } = require('../services/ai/recommendationEngine');

let passedTests = 0;
let failedTests = 0;

function it(description, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✔\x1b[0m ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  \x1b[31m✖\x1b[0m ${description}`);
    console.error(`    \x1b[31mError:\x1b[0m ${err.message}`);
    failedTests++;
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('       SMARTPRICE AUTOMATED TEST RUNNER');
  console.log('======================================================\n');

  // ---------------------------------------------------------
  // SUITE 1: Security & Sanitization
  // ---------------------------------------------------------
  console.log('\x1b[36m[SUITE 1] Security, Sanitization & Header Protection\x1b[0m');

  const { mongoSanitize, xssClean } = require('../middleware/securityMiddleware');

  it('NoSQL Injection Sanitizer should strip keys beginning with $ or containing .', () => {
    const maliciousBody = {
      email: 'user@example.com',
      password: { $gt: '' },
      'profile.admin': true,
      validField: 'hello',
    };
    const req = { body: maliciousBody };
    mongoSanitize(req, {}, () => {});
    assert.strictEqual(req.body.password.$gt, undefined, '$gt operator must be removed');
    assert.strictEqual(req.body['profile.admin'], undefined, 'Dot-notated keys must be removed');
    assert.strictEqual(req.body.email, 'user@example.com');
    assert.strictEqual(req.body.validField, 'hello');
  });

  it('XSS Sanitizer should strip malicious <script> tags from strings', () => {
    const maliciousInput = {
      comment: '<script>alert("hack")</script>Great price comparison platform!',
      nested: { payload: '<img src=x onerror=alert(1)>' },
    };
    const req = { body: maliciousInput };
    xssClean(req, {}, () => {});
    assert.strictEqual(req.body.comment, 'Great price comparison platform!');
    assert.strictEqual(req.body.nested.payload, '');
  });

  // ---------------------------------------------------------
  // SUITE 2: Price Calculation & Formula Accuracy
  // ---------------------------------------------------------
  console.log('\n\x1b[36m[SUITE 2] Price Calculation & Arbitrage Formulas\x1b[0m');

  it('Effective Price should strictly follow: Price + Delivery - Discount', () => {
    // ₹49,999 base + ₹100 delivery - ₹1,500 bank coupon = ₹48,599
    const eff = priceCalculator.computeEffectivePrice({
      price: 49999,
      deliveryCharge: 100,
      discount: 1500,
    });
    assert.strictEqual(eff, 48599);
  });

  it('Effective Price should handle 0 delivery and 0 discount without error', () => {
    const eff = priceCalculator.computeEffectivePrice({
      price: 7999,
      deliveryCharge: 0,
      discount: 0,
    });
    assert.strictEqual(eff, 7999);
  });

  it('compareOffers should identify lowest price retailer and maximum savings', () => {
    const offers = [
      { retailerName: 'Amazon India', price: 65999, deliveryCharge: 0, discount: 0, mrp: 79900 },
      { retailerName: 'Flipkart', price: 67999, deliveryCharge: 40, discount: 0, mrp: 79900 },
      { retailerName: 'Croma', price: 69900, deliveryCharge: 0, discount: 1000, mrp: 79900 },
    ];
    const result = priceCalculator.compareOffers(offers);
    assert.strictEqual(result.lowestOffer.retailerName, 'Amazon India');
    assert.strictEqual(result.lowestOffer.effectivePrice, 65999);
    assert(result.maxSavings > 0, 'Max savings should be calculated');
  });

  // ---------------------------------------------------------
  // SUITE 3: Product Matching & Variant Gatekeeper
  // ---------------------------------------------------------
  console.log('\n\x1b[36m[SUITE 3] Product Matching Engine & Variant Conflict Gatekeeper\x1b[0m');

  it('attributeExtractor should extract storage, RAM, and shoe size specifications', () => {
    const title1 = 'Apple iPhone 15 (128GB) - Blue';
    const specs1 = extractAttributes(title1);
    assert.strictEqual(specs1.storage.toLowerCase(), '128gb');

    const title2 = 'ASUS TUF Gaming F15 (16GB RAM, 512GB SSD)';
    const specs2 = extractAttributes(title2);
    assert(specs2.ram.toLowerCase().includes('16gb'));
    assert(specs2.storage.toLowerCase().includes('512gb'));

    const title3 = 'Nike Air Zoom Pegasus 40 - UK 9 Black';
    const specs3 = extractAttributes(title3);
    assert(specs3.size.toLowerCase().includes('9'));
  });

  it('ProductMatchingEngine must REJECT match when storage variants conflict (128GB vs 256GB)', () => {
    const p1 = { title: 'Apple iPhone 15 (128GB) - Blue', brand: 'Apple', category: 'Electronics' };
    const p2 = { title: 'Apple iPhone 15 (256GB) - Blue', brand: 'Apple', category: 'Electronics' };
    const result = productMatchingEngine.matchProducts(p1, p2);
    assert.strictEqual(result.isMatch, false, 'Should reject different storage capacities');
    assert.strictEqual(result.matchTier, 'REJECTED_VARIANT_CONFLICT');
  });

  it('ProductMatchingEngine must REJECT match when shoe sizes conflict (UK 8 vs UK 9)', () => {
    const s1 = { title: 'Nike Air Pegasus Running Shoes Size UK 8', brand: 'Nike', category: 'Footwear' };
    const s2 = { title: 'Nike Air Pegasus Running Shoes Size UK 9', brand: 'Nike', category: 'Footwear' };
    const result = productMatchingEngine.matchProducts(s1, s2);
    assert.strictEqual(result.isMatch, false, 'Should reject different shoe sizes');
    assert.strictEqual(result.matchTier, 'REJECTED_VARIANT_CONFLICT');
  });

  it('ProductMatchingEngine should ACCEPT match when titles describe the exact same item', () => {
    const p1 = { title: 'Apple iPhone 15 (128GB) - Blue', brand: 'Apple', model: 'iPhone 15' };
    const p2 = { title: 'Apple iPhone 15 128GB Blue Smartphone', brand: 'Apple', model: 'iPhone 15' };
    const result = productMatchingEngine.matchProducts(p1, p2);
    assert.strictEqual(result.isMatch, true, 'Should match identical product with minor syntax variation');
    assert(result.confidence >= 0.75, 'Confidence score should be high');
  });

  // ---------------------------------------------------------
  // SUITE 4: AI Query Parser & Deal Recommendation Engine
  // ---------------------------------------------------------
  console.log('\n\x1b[36m[SUITE 4] AI Query Parser & Deal Score Analytics\x1b[0m');

  it('parseNaturalLanguageQuery should extract brand, maxPrice, RAM, and intent', () => {
    const parsed = parseNaturalLanguageQuery('Best Asus gaming laptop under 75000 with 16GB RAM');
    assert.strictEqual(parsed.brand, 'Asus');
    assert.strictEqual(parsed.maxPrice, 75000);
    assert.strictEqual(parsed.attributes.ram, '16GB');
    assert.strictEqual(parsed.intent, 'budget_conscious');
  });

  it('Deal Score calculation should rate all-time-low product with STRONG_BUY (score >= 80)', () => {
    const { finalScore } = calculateDealScore({
      currentEffectivePrice: 64999,
      allTimeLow: 64999,
      averagePrice: 74999,
      highestPrice: 79900,
      runnerUpPrice: 68999,
      rating: 4.8,
      deliveryCharge: 0,
    });
    const verdict = getVerdict(finalScore);
    assert(finalScore >= 80, `Expected score >= 80, got ${finalScore}`);
    assert.strictEqual(verdict.status, 'STRONG_BUY');
  });

  it('Deal Score calculation should rate overpriced product with WAIT_FOR_SALE (score < 45)', () => {
    const { finalScore } = calculateDealScore({
      currentEffectivePrice: 92000,
      allTimeLow: 65000,
      averagePrice: 70000,
      highestPrice: 95000,
      runnerUpPrice: 91000,
      rating: 3.0,
      deliveryCharge: 150,
    });
    const verdict = getVerdict(finalScore);
    assert(finalScore < 45, `Expected score < 45, got ${finalScore}`);
    assert.strictEqual(verdict.status, 'WAIT_FOR_SALE');
  });

  // ---------------------------------------------------------
  // SUITE 5: Live HTTP & RBAC Security Integration
  // ---------------------------------------------------------
  console.log('\n\x1b[36m[SUITE 5] Live HTTP Security Headers & RBAC Enforcement\x1b[0m');

  const server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, async () => {
      const port = server.address().port;

      // Check Helmet headers
      const healthRes = await fetch(`http://localhost:${port}/api/health`, { headers: { Connection: 'close' } });
      it('Server should include Helmet security headers (CSP & Frameguard)', () => {
        assert.strictEqual(healthRes.status, 200);
        assert(healthRes.headers.get('content-security-policy'), 'CSP header should be present');
        assert.strictEqual(healthRes.headers.get('x-frame-options'), 'SAMEORIGIN');
      });

      // Check unauthenticated admin access
      const unauthAdmin = await fetch(`http://localhost:${port}/api/admin/analytics`, { headers: { Connection: 'close' } });
      it('Admin analytics endpoint must return 401 when token is missing', () => {
        assert.strictEqual(unauthAdmin.status, 401);
      });

      // Check non-admin access (role: 'user')
      const userToken = generateToken('demo_user_id');
      const forbiddenAdmin = await fetch(`http://localhost:${port}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${userToken}`, Connection: 'close' }
      });
      it('Admin analytics endpoint must return 403 Forbidden for non-admin users', () => {
        assert.strictEqual(forbiddenAdmin.status, 403);
      });

      // Check authorized admin access
      const adminToken = generateToken('demo_admin_id');
      const authorizedAdmin = await fetch(`http://localhost:${port}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${adminToken}`, Connection: 'close' }
      });
      it('Admin analytics endpoint must return 200 OK for verified admin tokens', () => {
        assert.strictEqual(authorizedAdmin.status, 200);
      });

      if (server.closeAllConnections) server.closeAllConnections();
      server.close(() => {
        resolve();
      });
    });
  });

  // ---------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------
  console.log('\n======================================================');
  console.log(`  TEST RESULTS: \x1b[32m${passedTests} PASSED\x1b[0m | \x1b[31m${failedTests} FAILED\x1b[0m`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exitCode = 1;
  }
}

runAllTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
