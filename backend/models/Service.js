const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Provider'
    },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    pricing: {
        basic: { type: Number, required: true },
        standard: { type: Number },
        premium: { type: Number }
    },
    duration: { type: String, default: '30 min' },
    visible: { type: Boolean, default: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
