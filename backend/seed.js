import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Restaurant from './models/Restaurant.js';
import FoodItem from './models/FoodItem.js';
import Order from './models/Order.js';
import Review from './models/Review.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/savora');
    console.log('Clearing existing data...');

    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});

    console.log('Creating initial users...');
    const adminUser = await User.create({
      name: 'Chef Alex Vance (Admin)',
      email: 'admin@savora.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+1 555-0199',
      address: { street: '742 Evergreen Terrace', city: 'Metropolis', zip: '10001' },
    });

    const customerUser = await User.create({
      name: 'Sophia Martinez',
      email: 'user@savora.com',
      password: 'userpassword123',
      role: 'customer',
      phone: '+1 555-0142',
      address: { street: '128 Ocean Avenue', city: 'Metropolis', zip: '10002' },
    });

    console.log('Creating featured restaurants...');
    const restaurant1 = await Restaurant.create({
      name: 'Lumina Gourmet Bistro',
      tagline: 'Modern European & Artisanal Comfort Food',
      description: 'Experience sensory dining with locally sourced organic ingredients, wood-fired delights, and hand-crafted sauces.',
      cuisine: ['European', 'Artisanal', 'Italian'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      address: '450 Grand Avenue, Downtown',
      rating: 4.9,
      deliveryTime: '20-30 min',
      priceRange: '$$$',
      owner: adminUser._id,
    });

    const restaurant2 = await Restaurant.create({
      name: 'Sakura & Smoke Izakaya',
      tagline: 'Japanese Ramen, Yakitori & AI Fusion',
      description: 'Authentic 18-hour tonkotsu broth, charcoal-grilled skewers, and contemporary Japanese bowls.',
      cuisine: ['Japanese', 'Ramen', 'Asian Fusion'],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      address: '88 Sakura Way, Midtown',
      rating: 4.8,
      deliveryTime: '25-35 min',
      priceRange: '$$',
      owner: adminUser._id,
    });

    console.log('Creating food items...');
    const foodItems = await FoodItem.insertMany([
      {
        restaurant: restaurant1._id,
        name: 'Truffle Wild Mushroom Tagliatelle',
        description: 'Hand-rolled fresh pasta tossed in black truffle velvet sauce, wild chanterelles, and aged Parmigiano Reggiano.',
        price: 24.50,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80',
        tags: ['Vegetarian', 'Truffle', 'Chef Special'],
        calories: 680,
      },
      {
        restaurant: restaurant1._id,
        name: 'Crispy Wood-Fired Burrata Flatbread',
        description: 'Creamy Puglia burrata, heirloom cherry tomatoes, fresh basil pesto, and micro-greens on a crisp artisanal crust.',
        price: 18.00,
        category: 'Appetizers',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        tags: ['Vegetarian', 'Artisanal'],
        calories: 520,
      },
      {
        restaurant: restaurant1._id,
        name: 'Valrhona Dark Chocolate Lava Cake',
        description: 'Decadent molten chocolate cake featuring 70% French dark cocoa served with Madagascar vanilla gelato.',
        price: 12.00,
        category: 'Desserts',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        tags: ['Sweet', 'Dessert'],
        calories: 490,
      },
      {
        restaurant: restaurant2._id,
        name: 'Signature Black Garlic Tonkotsu Ramen',
        description: 'Rich pork bone broth infused with charred black garlic oil, tender chashu belly, nitamago egg, and bamboo shoots.',
        price: 19.50,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        tags: ['Ramen', 'Spicy', 'Bestseller'],
        calories: 750,
      },
      {
        restaurant: restaurant2._id,
        name: 'Charcoal Skewered Wagyu Beef Yakitori',
        description: 'Glazed A5 Wagyu beef skewers grilled over binchotan charcoal with sweet tare reduction and shichimi pepper.',
        price: 22.00,
        category: 'Appetizers',
        image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
        tags: ['Gluten-Free', 'Grill'],
        calories: 410,
      },
      {
        restaurant: restaurant2._id,
        name: 'Yuzu Sparkling Botanical Elixir',
        description: 'Refreshing sparkling yuzu juice blended with organic green tea, mint leaves, and elderflower syrup.',
        price: 7.50,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        tags: ['Refreshing', 'Vegan'],
        calories: 120,
      },
    ]);

    console.log('Creating initial orders for Kanban board...');
    await Order.create([
      {
        customer: customerUser._id,
        customerName: customerUser.name,
        customerEmail: customerUser.email,
        restaurant: restaurant1._id,
        items: [
          { foodItem: foodItems[0]._id, name: foodItems[0].name, price: foodItems[0].price, quantity: 2 },
        ],
        totalAmount: 49.00,
        status: 'Preparing',
        paymentStatus: 'Paid',
        deliveryAddress: customerUser.address,
        specialNotes: 'Extra parmesan on the side please!',
      },
      {
        customer: customerUser._id,
        customerName: 'Marcus Wright',
        customerEmail: 'marcus@example.com',
        restaurant: restaurant2._id,
        items: [
          { foodItem: foodItems[3]._id, name: foodItems[3].name, price: foodItems[3].price, quantity: 1 },
          { foodItem: foodItems[5]._id, name: foodItems[5].name, price: foodItems[5].price, quantity: 1 },
        ],
        totalAmount: 27.00,
        status: 'Out for Delivery',
        paymentStatus: 'Paid',
        deliveryAddress: { street: '55 Park Lane', city: 'Metropolis', zip: '10003' },
        specialNotes: 'Call upon arrival.',
      },
      {
        customer: customerUser._id,
        customerName: 'Elena Rostova',
        customerEmail: 'elena@example.com',
        restaurant: restaurant1._id,
        items: [
          { foodItem: foodItems[1]._id, name: foodItems[1].name, price: foodItems[1].price, quantity: 1 },
          { foodItem: foodItems[2]._id, name: foodItems[2].name, price: foodItems[2].price, quantity: 2 },
        ],
        totalAmount: 42.00,
        status: 'Pending',
        paymentStatus: 'Paid',
        deliveryAddress: { street: '90 Riverside Dr', city: 'Metropolis', zip: '10005' },
      },
    ]);

    console.log('Creating initial reviews for AI analysis...');
    await Review.create([
      {
        restaurant: restaurant1._id,
        customer: customerUser._id,
        customerName: customerUser.name,
        rating: 5,
        comment: 'The Truffle Tagliatelle was sublime! Arrived piping hot and rich in flavor. Outstanding quality.',
        aiSentiment: 'Positive',
        aiKeywords: ['Truffle Tagliatelle', 'Hot Delivery', 'Rich Flavor'],
      },
      {
        restaurant: restaurant1._id,
        customer: customerUser._id,
        customerName: 'David K.',
        rating: 4,
        comment: 'Great burrata flatbread and chocolate lava cake. Delivery took slightly longer but food was superb.',
        aiSentiment: 'Positive',
        aiKeywords: ['Burrata Flatbread', 'Chocolate Lava Cake', 'Superb Food'],
      },
      {
        restaurant: restaurant2._id,
        customer: customerUser._id,
        customerName: 'Sarah Jenkins',
        rating: 5,
        comment: 'The black garlic tonkotsu ramen is the best in the city. Perfectly tender chashu and rich broth!',
        aiSentiment: 'Positive',
        aiKeywords: ['Black Garlic Ramen', 'Tender Chashu', 'Best in City'],
      },
    ]);

    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
