const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const industryCategories = [
    {
        name: "Salon & Grooming",
        icon: "Scissors",
        services: [
            { name: "Hair Cutting & Styling", basePrice: 150 },
            { name: "Beard Trimming & Shaving", basePrice: 100 },
            { name: "Facial & Cleanup", basePrice: 500 },
            { name: "Hair Spa", basePrice: 800 }
        ]
    },
    {
        name: "AC & Appliance Repair",
        icon: "AirVent",
        services: [
            { name: "AC Service", basePrice: 499 },
            { name: "AC Repair & Gas Fill", basePrice: 1500 },
            { name: "Washing Machine Repair", basePrice: 350 },
            { name: "Refrigerator Repair", basePrice: 400 }
        ]
    },
    {
        name: "Cleaning & Pest Control",
        icon: "Sparkles",
        services: [
            { name: "Full Home Cleaning", basePrice: 2499 },
            { name: "Bathroom Cleaning", basePrice: 399 },
            { name: "Sofa & Carpet Cleaning", basePrice: 599 },
            { name: "Pest Control", basePrice: 899 }
        ]
    },
    {
        name: "Electrician, Plumber & Carpenter",
        icon: "Wrench",
        services: [
            { name: "Fan Installation", basePrice: 150 },
            { name: "Switchboard Repair", basePrice: 100 },
            { name: "Tap/Sink Repair", basePrice: 200 },
            { name: "Pipe Leakage Fix", basePrice: 300 }
        ]
    },
    {
        name: "Health & Wellness",
        icon: "HeartPulse",
        services: [
            { name: "Full Body Massage", basePrice: 1200 },
            { name: "Physiotherapy at Home", basePrice: 600 },
            { name: "Yoga Trainer", basePrice: 400 }
        ]
    }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected to seed categories...');

        // Clear existing categories
        await Category.deleteMany();

        await Category.insertMany(industryCategories);

        console.log('Categories Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
