const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    promoCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    activeUsers: {
        type: Number,
        default: 0
    },
    spend: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'expired'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Promotion', promotionSchema);
