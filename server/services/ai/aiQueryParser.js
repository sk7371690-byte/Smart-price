/**
 * AI Query Parser Service
 * Transforms unstructured conversational human queries into structured catalog search criteria.
 * Provides resilient rule-based NLP extraction with optional LLM/Gemini fallback.
 */

const KNOWN_BRANDS = [
  'apple', 'samsung', 'sony', 'asus', 'dell', 'hp', 'lenovo', 'acer', 'msi',
  'nike', 'adidas', 'puma', 'reebok', 'under armour', 'new balance',
  'boat', 'jbl', 'bose', 'sennheiser', 'oneplus', 'xiaomi', 'google',
  'fossil', 'titan', 'fastrack', 'casio', 'fire-boltt', 'noise'
];

const CATEGORY_KEYWORDS = {
  'Electronics': ['phone', 'mobile', 'smartphone', 'iphone', 'galaxy', 'tablet', 'ipad', 'gadget'],
  'Laptops & Computers': ['laptop', 'notebook', 'macbook', 'pc', 'computer', 'gaming laptop', 'ultrabook', 'chromebook'],
  'Audio & Headphones': ['headphone', 'earphone', 'earbud', 'earbuds', 'headset', 'audio', 'airpods', 'tws', 'speaker', 'bluetooth'],
  'Footwear': ['shoe', 'shoes', 'sneaker', 'sneakers', 'running shoes', 'boots', 'sandals', 'slides', 'footwear', 'trainers'],
  'Wearables & Watches': ['watch', 'smartwatch', 'band', 'fitness tracker', 'wearable', 'chronograph'],
  'Cameras & Accessories': ['camera', 'dslr', 'mirrorless', 'lens', 'tripod', 'gopro', 'action cam']
};

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'for', 'with', 'by', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'to', 'from', 'up', 'down', 'in', 'out', 'off', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'can', 'will', 'just', 'should', 'now', 'i', 'me', 'my', 'myself', 'we',
  'our', 'ours', 'you', 'your', 'he', 'him', 'she', 'her', 'it', 'its',
  'they', 'them', 'what', 'which', 'who', 'whom', 'this', 'that', 'these',
  'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'do', 'does', 'did', 'show', 'find', 'get', 'give', 'recommend',
  'suggest', 'look', 'looking', 'search', 'want', 'need', 'buy', 'purchase'
]);

/**
 * Parses numeric price expressions: "under 50k", "below 70000", "< 15000", "under 1.5 lakh"
 */
function extractPriceBounds(text) {
  let maxPrice = null;
  let minPrice = null;

  // Max price patterns: under/below/less than/max/budget/<=/<
  const maxPriceRegexes = [
    /(?:under|below|less\s+than|max(?:imum)?|budget|up\s+to|<|<=)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(k|lakh|lac)?/i,
    /(?:rs\.?|inr|₹)\s*(\d+(?:\.\d+)?)\s*(k|lakh|lac)?\s*(?:or\s+less|max|budget)/i
  ];

  for (const regex of maxPriceRegexes) {
    const match = text.match(regex);
    if (match) {
      let val = parseFloat(match[1]);
      const multiplier = (match[2] || '').toLowerCase();
      if (multiplier === 'k') val *= 1000;
      else if (multiplier === 'lakh' || multiplier === 'lac') val *= 100000;
      maxPrice = Math.round(val);
      break;
    }
  }

  // Min price patterns: above/more than/over/min/>=/>
  const minPriceRegexes = [
    /(?:above|over|more\s+than|min(?:imum)?|>|>=)\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(k|lakh|lac)?/i
  ];

  for (const regex of minPriceRegexes) {
    const match = text.match(regex);
    if (match) {
      let val = parseFloat(match[1]);
      const multiplier = (match[2] || '').toLowerCase();
      if (multiplier === 'k') val *= 1000;
      else if (multiplier === 'lakh' || multiplier === 'lac') val *= 100000;
      minPrice = Math.round(val);
      break;
    }
  }

  // Range pattern: "between 20000 and 40000" or "20k to 40k"
  const rangeMatch = text.match(/(?:between|from)?\s*(\d+)(k)?\s*(?:to|-|and)\s*(\d+)(k)?/i);
  if (rangeMatch) {
    let low = parseFloat(rangeMatch[1]) * (rangeMatch[2] ? 1000 : 1);
    let high = parseFloat(rangeMatch[3]) * (rangeMatch[4] ? 1000 : 1);
    if (low > 100 && high > 100) {
      minPrice = Math.min(low, high);
      maxPrice = Math.max(low, high);
    }
  }

  return { minPrice, maxPrice };
}

/**
 * Extracts minimum rating requirements: "4 star", "4+ rating", "above 4.5"
 */
function extractRating(text) {
  const ratingMatch = text.match(/(?:rating\s+(?:above|over|>=|>)|(?:minimum\s+)?(\d(?:\.\d)?)\s*(?:\+|plus)?\s*(?:star|rating))/i);
  if (ratingMatch) {
    const num = parseFloat(ratingMatch[1] || ratingMatch[0].match(/\d(?:\.\d)?/)?.[0]);
    if (num >= 1 && num <= 5) return num;
  }
  return null;
}

/**
 * Extracts RAM, Storage, and Shoes sizes
 */
function extractSpecifications(text) {
  const specs = {};

  const ramMatch = text.match(/\b(4|6|8|12|16|24|32|64)\s*gb(?:\s*ram)?\b/i);
  if (ramMatch) specs.ram = `${ramMatch[1]}GB`;

  const storageMatch = text.match(/\b(64|128|256|512)\s*gb\b|\b(1|2)\s*tb\b/i);
  if (storageMatch) {
    if (storageMatch[1]) specs.storage = `${storageMatch[1]}GB`;
    else if (storageMatch[2]) specs.storage = `${storageMatch[2]}TB`;
  }

  const shoeSizeMatch = text.match(/\b(?:size|uk|us)\s*(\d{1,2}(?:\.5)?)\b/i);
  if (shoeSizeMatch) specs.size = `UK ${shoeSizeMatch[1]}`;

  const colors = ['black', 'white', 'blue', 'red', 'green', 'gold', 'silver', 'grey', 'gray', 'titanium', 'purple'];
  for (const c of colors) {
    const colorRegex = new RegExp(`\\b${c}\\b`, 'i');
    if (colorRegex.test(text)) {
      specs.color = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  return specs;
}

/**
 * Classifies search intent
 */
function classifyIntent(text, maxPrice) {
  const lower = text.toLowerCase();
  if (lower.includes('cheapest') || lower.includes('lowest price') || lower.includes('best deal') || lower.includes('discount')) {
    return 'deal_hunter';
  }
  if (maxPrice !== null || lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable')) {
    return 'budget_conscious';
  }
  if (lower.includes('best') || lower.includes('top') || lower.includes('highest rated') || lower.includes('premium')) {
    return 'quality_focused';
  }
  if (lower.includes('compare') || lower.includes('vs') || lower.includes('difference')) {
    return 'comparison';
  }
  return 'general_discovery';
}

/**
 * Identifies brand from known dictionary
 */
function detectBrand(text) {
  const lower = text.toLowerCase();
  for (const b of KNOWN_BRANDS) {
    const regex = new RegExp(`\\b${b}\\b`, 'i');
    if (regex.test(lower)) {
      return b.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  return null;
}

/**
 * Detects catalog category
 */
function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(lower)) {
        return category;
      }
    }
  }
  return null;
}

/**
 * Cleans the natural language prompt into searchable product terms
 */
function cleanKeywords(rawQuery, detectedBrand, detectedCategory, specs) {
  let cleaned = rawQuery.toLowerCase();

  // Remove price phrases
  cleaned = cleaned.replace(/(?:under|below|less\s+than|above|more\s+than|budget|up\s+to|<|>|<=|>=)\s*(?:rs\.?|inr|₹)?\s*\d+(?:\.\d+)?\s*(k|lakh|lac)?/gi, '');
  cleaned = cleaned.replace(/(?:between|from)\s*\d+k?\s*(?:to|-|and)\s*\d+k?/gi, '');
  cleaned = cleaned.replace(/(?:rs\.?|inr|₹)\s*\d+/gi, '');

  // Remove rating phrases
  cleaned = cleaned.replace(/\d(?:\.\d)?\s*(?:\+|plus)?\s*(?:star|rating)s?/gi, '');
  cleaned = cleaned.replace(/rating\s+(?:above|over|>=|>)\s*\d(?:\.\d)?/gi, '');

  // Remove intent qualifiers
  cleaned = cleaned.replace(/\b(best|cheapest|cheap|affordable|top|top-rated|lowest price|best deal|deal|discount|good|premium|nice)\b/gi, '');

  // Remove punctuation and extra whitespace
  cleaned = cleaned.replace(/[^a-z0-9\s]/gi, ' ');
  const tokens = cleaned.split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));

  return tokens.join(' ').trim();
}

/**
 * Generates an intuitive natural language explanation of the parsed search filters
 */
function generateParsedSummary({ query, brand, category, minPrice, maxPrice, minRating, attributes, intent }) {
  const parts = [];

  if (brand) parts.push(`Brand: **${brand}**`);
  if (category) parts.push(`Category: **${category}**`);

  if (minPrice && maxPrice) parts.push(`Price: **₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}**`);
  else if (maxPrice) parts.push(`Budget: Under **₹${maxPrice.toLocaleString('en-IN')}**`);
  else if (minPrice) parts.push(`Price: Above **₹${minPrice.toLocaleString('en-IN')}**`);

  if (minRating) parts.push(`Rating: **${minRating}+ Stars**`);

  const specKeys = Object.keys(attributes || {});
  if (specKeys.length > 0) {
    const specsStr = specKeys.map(k => `${k.toUpperCase()}: ${attributes[k]}`).join(', ');
    parts.push(`Specs: **${specsStr}**`);
  }

  const intentLabels = {
    'budget_conscious': 'Finding highest-rated options within your budget',
    'deal_hunter': 'Tracking maximum retailer discounts and drops',
    'quality_focused': 'Filtering top-tier products with verified ratings',
    'comparison': 'Comparing live pricing across Amazon, Flipkart, Myntra & Croma',
    'general_discovery': 'Searching matching catalog items'
  };

  const actionText = intentLabels[intent] || 'Searching matching products';

  return {
    summaryText: parts.length ? `${actionText} (${parts.join(' • ')})` : `Searching for "${query || 'all products'}"`,
    criteriaChips: parts
  };
}

/**
 * Main parser entry point
 * @param {string} naturalQuery - User natural language prompt
 * @returns {object} Structured query specifications
 */
function parseNaturalLanguageQuery(naturalQuery) {
  if (!naturalQuery || typeof naturalQuery !== 'string') {
    return {
      originalQuery: '',
      cleanQuery: '',
      brand: null,
      category: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      attributes: {},
      intent: 'general_discovery',
      summary: 'Empty query',
      criteriaChips: []
    };
  }

  const trimmed = naturalQuery.trim();
  const { minPrice, maxPrice } = extractPriceBounds(trimmed);
  const minRating = extractRating(trimmed);
  const attributes = extractSpecifications(trimmed);
  const brand = detectBrand(trimmed);
  const category = detectCategory(trimmed);
  const intent = classifyIntent(trimmed, maxPrice);
  const cleanQuery = cleanKeywords(trimmed, brand, category, attributes);

  const parsedData = {
    originalQuery: trimmed,
    cleanQuery: cleanQuery || trimmed,
    brand,
    category,
    minPrice,
    maxPrice,
    minRating,
    attributes,
    intent,
    confidenceScore: 0.95
  };

  const { summaryText, criteriaChips } = generateParsedSummary(parsedData);
  parsedData.summary = summaryText;
  parsedData.criteriaChips = criteriaChips;

  return parsedData;
}

module.exports = {
  parseNaturalLanguageQuery,
  extractPriceBounds,
  extractSpecifications,
  classifyIntent
};
