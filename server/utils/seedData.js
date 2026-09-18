require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const {
  User,
  Retailer,
  Product,
  Offer,
  PriceHistory,
} = require('../models');

const retailersSeed = [
  {
    name: 'Amazon India',
    slug: 'amazon',
    logoUrl: 'https://img.icons8.com/color/48/amazon.png',
    websiteUrl: 'https://www.amazon.in',
    isActive: true,
    rating: 4.8,
  },
  {
    name: 'Flipkart',
    slug: 'flipkart',
    logoUrl: 'https://img.icons8.com/color/48/flipkart.png',
    websiteUrl: 'https://www.flipkart.com',
    isActive: true,
    rating: 4.7,
  },
  {
    name: 'Myntra',
    slug: 'myntra',
    logoUrl: 'https://img.icons8.com/color/48/myntra.png',
    websiteUrl: 'https://www.myntra.com',
    isActive: true,
    rating: 4.6,
  },
  {
    name: 'Tata Croma',
    slug: 'croma',
    logoUrl: 'https://img.icons8.com/color/48/shopping-cart.png',
    websiteUrl: 'https://www.croma.com',
    isActive: true,
    rating: 4.5,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartprice';
    console.log(`[Database Seeder] Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Database Seeder] MongoDB Connected successfully.');

    // 1. Clear existing collections
    await User.deleteMany({});
    await Retailer.deleteMany({});
    await Product.deleteMany({});
    await Offer.deleteMany({});
    await PriceHistory.deleteMany({});
    console.log('[Database Seeder] Cleared previous records.');

    // 2. Create Users
    const adminUser = await User.create({
      name: 'SmartPrice Administrator',
      email: 'admin@smartprice.com',
      password: 'adminpassword123',
      role: 'admin',
    });

    const demoUser = await User.create({
      name: 'Shailesh User',
      email: 'user@smartprice.com',
      password: 'userpassword123',
      role: 'user',
    });
    console.log('[Database Seeder] Admin and demo users seeded.');

    // 3. Create Retailers
    const createdRetailers = await Retailer.insertMany(retailersSeed);
    const retailerMap = {};
    createdRetailers.forEach((r) => {
      retailerMap[r.slug] = r;
    });
    console.log(`[Database Seeder] Seeded ${createdRetailers.length} retailers.`);

    // 4. Products & Multi-Store Offers
    const productsData = [
      {
        product: {
          title: 'Nike Air Max 270 Men Running Shoes',
          brand: 'Nike',
          model: 'Air Max 270',
          category: 'Footwear',
          sku: 'NIKE-AM270-BLK',
          gtin: '0192499318182',
          attributes: {
            Size: 'UK 9',
            Color: 'Black / University Red',
            Material: 'Breathable Mesh',
            Closure: 'Lace-Up',
          },
          thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
          description: 'The Nike Air Max 270 delivers unmatched all-day comfort with Nike\'s biggest heel Air unit yet.',
          rating: 4.6,
          reviewsCount: 1420,
        },
        offers: [
          {
            retailerSlug: 'flipkart',
            price: 4899,
            mrp: 6999,
            deliveryCharge: 0,
            discount: 0,
            availability: 'In Stock',
            deliveryTime: '2 Days Free Delivery',
            seller: 'RetailNet Authentic',
            productUrl: 'https://www.flipkart.com/item/nike-air-max-270',
          },
          {
            retailerSlug: 'myntra',
            price: 5099,
            mrp: 6999,
            deliveryCharge: 0,
            discount: 0,
            availability: 'In Stock',
            deliveryTime: 'Tomorrow By 7 PM',
            seller: 'Nike Official Store',
            productUrl: 'https://www.myntra.com/item/nike-air-max-270',
          },
          {
            retailerSlug: 'amazon',
            price: 5249,
            mrp: 6999,
            deliveryCharge: 50,
            discount: 0,
            availability: 'In Stock',
            deliveryTime: 'Same Day with Prime',
            seller: 'Appario Retail',
            productUrl: 'https://www.amazon.in/dp/B07T9W7WKN',
          },
          {
            retailerSlug: 'croma',
            price: 5399,
            mrp: 6999,
            deliveryCharge: 0,
            discount: 0,
            availability: 'Limited Stock',
            deliveryTime: '3-4 Days',
            seller: 'Tata Croma Lifestyle',
            productUrl: 'https://www.croma.com/p/nike-air-max-270',
          },
        ],
        history: [5499, 5299, 5299, 5199, 5099, 4999, 4899],
      },
      {
        product: {
          title: 'Samsung Galaxy S24 5G (Onyx Black, 256 GB, 8 GB RAM)',
          brand: 'Samsung',
          model: 'Galaxy S24',
          category: 'Mobiles',
          sku: 'SM-S921B-256',
          gtin: '8806095318182',
          attributes: {
            RAM: '8 GB',
            Storage: '256 GB',
            Color: 'Onyx Black',
            Processor: 'Exynos 2400 Deca-Core',
          },
          thumbnailUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
          description: 'Meet Galaxy S24 with Galaxy AI. 6.2-inch Dynamic AMOLED 2X Display with 120Hz refresh rate.',
          rating: 4.7,
          reviewsCount: 3890,
        },
        offers: [
          {
            retailerSlug: 'amazon',
            price: 74999,
            mrp: 84999,
            deliveryCharge: 0,
            discount: 2000,
            availability: 'In Stock',
            deliveryTime: 'Tomorrow By 11 AM',
            seller: 'STPL Exclusive',
            productUrl: 'https://www.amazon.in/dp/B0CQ2W518B',
          },
          {
            retailerSlug: 'flipkart',
            price: 74999,
            mrp: 84999,
            deliveryCharge: 99,
            discount: 1500,
            availability: 'In Stock',
            deliveryTime: '2 Days Delivery',
            seller: 'OmniTech Retail',
            productUrl: 'https://www.flipkart.com/item/samsung-galaxy-s24',
          },
          {
            retailerSlug: 'croma',
            price: 75990,
            mrp: 84999,
            deliveryCharge: 0,
            discount: 1000,
            availability: 'In Stock',
            deliveryTime: 'Pick up in store in 2 hrs',
            seller: 'Croma Electronics',
            productUrl: 'https://www.croma.com/p/samsung-galaxy-s24',
          },
        ],
        history: [79999, 78999, 76999, 75999, 74999, 73999, 72999],
      },
      {
        product: {
          title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
          brand: 'Sony',
          model: 'WH-1000XM5',
          category: 'Audio',
          sku: 'SONY-WH1000XM5-SILVER',
          gtin: '4548736132580',
          attributes: {
            Color: 'Silver White',
            Type: 'Over-Ear Wireless',
            Battery: '30 Hours Playback',
          },
          thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
          description: 'Industry-leading noise cancellation with two processors and 8 microphones.',
          rating: 4.8,
          reviewsCount: 2150,
        },
        offers: [
          {
            retailerSlug: 'croma',
            price: 26990,
            mrp: 34990,
            deliveryCharge: 0,
            discount: 1000,
            availability: 'In Stock',
            deliveryTime: 'Free Delivery by Friday',
            seller: 'Croma Audio Hub',
            productUrl: 'https://www.croma.com/p/sony-wh1000xm5',
          },
          {
            retailerSlug: 'amazon',
            price: 26990,
            mrp: 34990,
            deliveryCharge: 0,
            discount: 0,
            availability: 'In Stock',
            deliveryTime: 'Next Day Delivery',
            seller: 'Appario Electronics',
            productUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
          },
          {
            retailerSlug: 'flipkart',
            price: 27490,
            mrp: 34990,
            deliveryCharge: 50,
            discount: 0,
            availability: 'In Stock',
            deliveryTime: '3 Days Delivery',
            seller: 'SuperComNet',
            productUrl: 'https://www.flipkart.com/item/sony-wh1000xm5',
          },
        ],
        history: [29990, 28990, 28490, 27990, 26990, 26490, 25990],
      },
    ];

    for (const item of productsData) {
      const createdProduct = await Product.create(item.product);

      let lowestOfferObj = null;

      for (const off of item.offers) {
        const retailer = retailerMap[off.retailerSlug];
        if (!retailer) continue;

        const createdOffer = await Offer.create({
          product: createdProduct._id,
          retailer: retailer._id,
          price: off.price,
          mrp: off.mrp,
          deliveryCharge: off.deliveryCharge,
          discount: off.discount,
          availability: off.availability,
          deliveryTime: off.deliveryTime,
          seller: off.seller,
          productUrl: off.productUrl,
        });

        if (!lowestOfferObj || createdOffer.effectivePrice < lowestOfferObj.effectivePrice) {
          lowestOfferObj = {
            offerId: createdOffer._id,
            retailerId: retailer._id,
            retailerName: retailer.name,
            price: createdOffer.price,
            effectivePrice: createdOffer.effectivePrice,
          };
        }
      }

      // Update product with lowest offer reference
      createdProduct.lowestOffer = lowestOfferObj;
      await createdProduct.save();

      // Seed 7-day price history
      const now = new Date();
      for (let i = 0; i < item.history.length; i++) {
        const recordDate = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        await PriceHistory.create({
          product: createdProduct._id,
          retailer: createdRetailers[0]._id,
          price: item.history[i],
          effectivePrice: item.history[i],
          recordedAt: recordDate,
        });
      }
    }

    console.log(`[Database Seeder] Successfully seeded ${productsData.length} master products with offers and history!`);
    console.log(`[Database Seeder] Done.`);
    process.exit(0);
  } catch (error) {
    console.error(`[Database Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
