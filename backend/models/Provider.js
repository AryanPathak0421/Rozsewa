const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const providerSchema = mongoose.Schema({
    ownerName: { type: String, required: true },
    shopName: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    businessType: { type: String },
    vendorType: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subServices: [{ type: String }],
    vendorCode: { type: String, unique: true }, // RSVNDxxxxx
    address: { type: String, required: true },
    addresses: [
        {
            label: { type: String },
            address: { type: String },
            icon: { type: String, default: 'home' }
        }
    ],
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number], // [longitude, latitude]
    },
    gst: { type: String },
    kycAadhaar: { type: String },
    kycAadhaarPhoto: { type: String },
    kycPanPhoto: { type: String },
    status: { type: String, enum: ['pending', 'verified', 'suspended'], default: 'pending' },
    isOnline: { type: Boolean, default: true },
    isEmergencyEnabled: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    referralCode: { type: String },
    employeeCode: { type: String },
    profileImage: { type: String },
    commissionFreeBookings: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Password comparison
providerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
providerSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Provider = mongoose.model('Provider', providerSchema);
module.exports = Provider;
