export const mockProducts = [
  {
    id: 'prod-1',
    title: 'Nike Air Max 270 Men Running Shoes',
    brand: 'Nike',
    category: 'Footwear',
    rating: 4.6,
    reviewsCount: 1420,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    description: 'The Nike Air Max 270 delivers unmatched all-day comfort with Nike\'s biggest heel Air unit yet. Lightweight, breathable mesh upper and dual-density foam sole.',
    attributes: {
      Size: 'UK 9',
      Color: 'Black / University Red',
      Material: 'Breathable Mesh',
      Closure: 'Lace-Up',
      Warranty: '6 Months Manufacturer'
    },
    offers: [
      {
        retailer: 'Flipkart',
        retailerSlug: 'flipkart',
        logo: 'https://img.icons8.com/color/48/flipkart.png',
        price: 4899,
        mrp: 6999,
        deliveryCharge: 0,
        discount: 0,
        effectivePrice: 4899,
        availability: 'In Stock',
        deliveryTime: '2 Days Free Delivery',
        seller: 'RetailNet Authentic',
        productUrl: 'https://www.flipkart.com'
      },
      {
        retailer: 'Myntra',
        retailerSlug: 'myntra',
        logo: 'https://img.icons8.com/color/48/myntra.png',
        price: 5099,
        mrp: 6999,
        deliveryCharge: 0,
        discount: 0,
        effectivePrice: 5099,
        availability: 'In Stock',
        deliveryTime: 'Tomorrow By 7 PM',
        seller: 'Nike Official Store',
        productUrl: 'https://www.myntra.com'
      },
      {
        retailer: 'Amazon',
        retailerSlug: 'amazon',
        logo: 'https://img.icons8.com/color/48/amazon.png',
        price: 5249,
        mrp: 6999,
        deliveryCharge: 50,
        discount: 0,
        effectivePrice: 5299,
        availability: 'In Stock',
        deliveryTime: 'Same Day with Prime',
        seller: 'Appario Retail',
        productUrl: 'https://www.amazon.in'
      },
      {
        retailer: 'Croma',
        retailerSlug: 'croma',
        logo: 'https://img.icons8.com/color/48/shopping-cart.png',
        price: 5399,
        mrp: 6999,
        deliveryCharge: 0,
        discount: 0,
        effectivePrice: 5399,
        availability: 'Limited Stock',
        deliveryTime: '3-4 Days',
        seller: 'Tata Croma Lifestyle',
        productUrl: 'https://www.croma.com'
      }
    ],
    priceHistory: [
      { date: '10 Sep', price: 5499 },
      { date: '11 Sep', price: 5299 },
      { date: '12 Sep', price: 5299 },
      { date: '13 Sep', price: 5199 },
      { date: '14 Sep', price: 5099 },
      { date: '15 Sep', price: 4999 },
      { date: 'Today', price: 4899 }
    ]
  },
  {
    id: 'prod-2',
    title: 'Samsung Galaxy S24 5G (Onyx Black, 256 GB, 8 GB RAM)',
    brand: 'Samsung',
    category: 'Mobiles',
    rating: 4.7,
    reviewsCount: 3890,
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    description: 'Meet Galaxy S24 with Galaxy AI. 6.2-inch Dynamic AMOLED 2X Display with 120Hz refresh rate, 50MP ProVisual Engine camera, and vapor chamber cooling.',
    attributes: {
      RAM: '8 GB',
      Storage: '256 GB',
      Color: 'Onyx Black',
      Processor: 'Exynos 2400 Deca-Core',
      Battery: '4000 mAh Fast Charging'
    },
    offers: [
      {
        retailer: 'Amazon',
        retailerSlug: 'amazon',
        logo: 'https://img.icons8.com/color/48/amazon.png',
        price: 74999,
        mrp: 84999,
        deliveryCharge: 0,
        discount: 2000,
        effectivePrice: 72999,
        availability: 'In Stock',
        deliveryTime: 'Tomorrow By 11 AM',
        seller: 'STPL Exclusive',
        productUrl: 'https://www.amazon.in'
      },
      {
        retailer: 'Flipkart',
        retailerSlug: 'flipkart',
        logo: 'https://img.icons8.com/color/48/flipkart.png',
        price: 74999,
        mrp: 84999,
        deliveryCharge: 99,
        discount: 1500,
        effectivePrice: 73598,
        availability: 'In Stock',
        deliveryTime: '2 Days Delivery',
        seller: 'OmniTech Retail',
        productUrl: 'https://www.flipkart.com'
      },
      {
        retailer: 'Croma',
        retailerSlug: 'croma',
        logo: 'https://img.icons8.com/color/48/shopping-cart.png',
        price: 75990,
        mrp: 84999,
        deliveryCharge: 0,
        discount: 1000,
        effectivePrice: 74990,
        availability: 'In Stock',
        deliveryTime: 'Pick up in store in 2 hrs',
        seller: 'Croma Electronics',
        productUrl: 'https://www.croma.com'
      }
    ],
    priceHistory: [
      { date: '10 Sep', price: 79999 },
      { date: '11 Sep', price: 78999 },
      { date: '12 Sep', price: 76999 },
      { date: '13 Sep', price: 75999 },
      { date: '14 Sep', price: 74999 },
      { date: '15 Sep', price: 73999 },
      { date: 'Today', price: 72999 }
    ]
  },
  {
    id: 'prod-3',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    category: 'Audio',
    rating: 4.8,
    reviewsCount: 2150,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging, crystal clear hands-free calls.',
    attributes: {
      Color: 'Silver White',
      Type: 'Over-Ear Wireless',
      Battery: '30 Hours Playback',
      Connectivity: 'Bluetooth 5.2 + 3.5mm Aux',
      Warranty: '1 Year Brand Warranty'
    },
    offers: [
      {
        retailer: 'Croma',
        retailerSlug: 'croma',
        logo: 'https://img.icons8.com/color/48/shopping-cart.png',
        price: 26990,
        mrp: 34990,
        deliveryCharge: 0,
        discount: 1000,
        effectivePrice: 25990,
        availability: 'In Stock',
        deliveryTime: 'Free Delivery by Friday',
        seller: 'Croma Audio Hub',
        productUrl: 'https://www.croma.com'
      },
      {
        retailer: 'Amazon',
        retailerSlug: 'amazon',
        logo: 'https://img.icons8.com/color/48/amazon.png',
        price: 26990,
        mrp: 34990,
        deliveryCharge: 0,
        discount: 0,
        effectivePrice: 26990,
        availability: 'In Stock',
        deliveryTime: 'Next Day Delivery',
        seller: 'Appario Electronics',
        productUrl: 'https://www.amazon.in'
      },
      {
        retailer: 'Flipkart',
        retailerSlug: 'flipkart',
        logo: 'https://img.icons8.com/color/48/flipkart.png',
        price: 27490,
        mrp: 34990,
        deliveryCharge: 50,
        discount: 0,
        effectivePrice: 27540,
        availability: 'In Stock',
        deliveryTime: '3 Days Delivery',
        seller: 'SuperComNet',
        productUrl: 'https://www.flipkart.com'
      }
    ],
    priceHistory: [
      { date: '10 Sep', price: 29990 },
      { date: '11 Sep', price: 28990 },
      { date: '12 Sep', price: 28490 },
      { date: '13 Sep', price: 27990 },
      { date: '14 Sep', price: 26990 },
      { date: '15 Sep', price: 26490 },
      { date: 'Today', price: 25990 }
    ]
  },
  {
    id: 'prod-4',
    title: 'Apple MacBook Air 13-inch M2 (8-Core CPU, 8GB RAM, 256GB SSD, Midnight)',
    brand: 'Apple',
    category: 'Laptops',
    rating: 4.9,
    reviewsCount: 5210,
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    description: 'Strikingly thin design. Supercharged by M2 chip with incredible performance and up to 18 hours of battery life. 13.6-inch Liquid Retina display.',
    attributes: {
      Chipset: 'Apple M2 8-Core',
      RAM: '8 GB Unified Memory',
      Storage: '256 GB NVMe SSD',
      Display: '13.6-inch Liquid Retina',
      Weight: '1.24 kg Ultralight'
    },
    offers: [
      {
        retailer: 'Flipkart',
        retailerSlug: 'flipkart',
        logo: 'https://img.icons8.com/color/48/flipkart.png',
        price: 84990,
        mrp: 99900,
        deliveryCharge: 0,
        discount: 3000,
        effectivePrice: 81990,
        availability: 'In Stock',
        deliveryTime: 'Tomorrow By 2 PM',
        seller: 'IndiFlashMart',
        productUrl: 'https://www.flipkart.com'
      },
      {
        retailer: 'Amazon',
        retailerSlug: 'amazon',
        logo: 'https://img.icons8.com/color/48/amazon.png',
        price: 84990,
        mrp: 99900,
        deliveryCharge: 0,
        discount: 1000,
        effectivePrice: 83990,
        availability: 'In Stock',
        deliveryTime: 'Same Day Delivery',
        seller: 'Amazon Prime Verified',
        productUrl: 'https://www.amazon.in'
      },
      {
        retailer: 'Croma',
        retailerSlug: 'croma',
        logo: 'https://img.icons8.com/color/48/shopping-cart.png',
        price: 86900,
        mrp: 99900,
        deliveryCharge: 0,
        discount: 2000,
        effectivePrice: 84900,
        availability: 'In Stock',
        deliveryTime: 'Free Express Delivery',
        seller: 'Apple Authorized Croma',
        productUrl: 'https://www.croma.com'
      }
    ],
    priceHistory: [
      { date: '10 Sep', price: 92900 },
      { date: '11 Sep', price: 89900 },
      { date: '12 Sep', price: 87900 },
      { date: '13 Sep', price: 85900 },
      { date: '14 Sep', price: 83900 },
      { date: '15 Sep', price: 82900 },
      { date: 'Today', price: 81990 }
    ]
  }
];

// Helper to get product lowest offer
export const getLowestOffer = (offers = []) => {
  if (!offers.length) return null;
  return offers.reduce((prev, curr) =>
    curr.effectivePrice < prev.effectivePrice ? curr : prev
  );
};
