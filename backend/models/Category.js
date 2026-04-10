const mongoose = require('mongoose');

const subServiceSchema = mongoose.Schema({
    name: { type: String, required: true },
    basePrice: { type: Number, default: 0 },
    description: { type: String }
});

const categorySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    icon: { type: String }, // Lucide icon name
    isActive: { type: Boolean, default: true },
    index: { type: Number, default: 0 }, // For ordering
    services: [subServiceSchema] // Pre-defined services in this category
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
