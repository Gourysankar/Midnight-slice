const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Inventory = require('../models/Inventory');

// Ensure absolute path resolution dynamically
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const maskedURI = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED';
        console.log(`Attempting connection to: ${maskedURI}`);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding via process.env.MONGO_URI...');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await Inventory.deleteMany({});

        // Add 5 items for each customization section
        const inventoryItems = [
            // Bases
            { itemName: 'Thin Crust', category: 'base', quantity: 100, price: 50 },
            { itemName: 'Thick Crust', category: 'base', quantity: 100, price: 60 },
            { itemName: 'Cheese Burst', category: 'base', quantity: 100, price: 90 },
            { itemName: 'Wheat Base', category: 'base', quantity: 100, price: 55 },
            { itemName: 'Gluten Free', category: 'base', quantity: 100, price: 80 },

            // Sauces
            { itemName: 'Classic Tomato', category: 'sauce', quantity: 100, price: 20 },
            { itemName: 'Spicy Marinara', category: 'sauce', quantity: 100, price: 25 },
            { itemName: 'Barbecue', category: 'sauce', quantity: 100, price: 30 },
            { itemName: 'Pesto', category: 'sauce', quantity: 100, price: 40 },
            { itemName: 'Garlic Parmesan', category: 'sauce', quantity: 100, price: 35 },

            // Cheese
            { itemName: 'Mozzarella', category: 'cheese', quantity: 100, price: 40 },
            { itemName: 'Cheddar', category: 'cheese', quantity: 100, price: 45 },
            { itemName: 'Paneer (Cottage Cheese)', category: 'cheese', quantity: 100, price: 50 },
            { itemName: 'Feta', category: 'cheese', quantity: 100, price: 60 },
            { itemName: 'Gouda', category: 'cheese', quantity: 100, price: 55 },

            // Veggies
            { itemName: 'Onions', category: 'veggies', quantity: 100, price: 15 },
            { itemName: 'Capsicum', category: 'veggies', quantity: 100, price: 15 },
            { itemName: 'Mushrooms', category: 'veggies', quantity: 100, price: 25 },
            { itemName: 'Black Olives', category: 'veggies', quantity: 100, price: 30 },
            { itemName: 'Jalapenos', category: 'veggies', quantity: 100, price: 20 },

            // Meat
            { itemName: 'Pepperoni', category: 'meat', quantity: 100, price: 60 },
            { itemName: 'Grilled Chicken', category: 'meat', quantity: 100, price: 50 },
            { itemName: 'BBQ Chicken', category: 'meat', quantity: 100, price: 55 },
            { itemName: 'Bacon', category: 'meat', quantity: 100, price: 70 },
            { itemName: 'Sausage', category: 'meat', quantity: 100, price: 45 },
        ];

        await Inventory.insertMany(inventoryItems);
        console.log('Database successfully seeded with 5 types of Pizza Bases, Sauces, Cheeses, Veggies, and Meats!');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
