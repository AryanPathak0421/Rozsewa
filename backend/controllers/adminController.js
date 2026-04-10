const Provider = require('../models/Provider');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all providers for admin
// @route   GET /api/admin/providers
// @access  Private/Admin
const getProviders = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const providers = await Provider.find(query).sort({ createdAt: -1 });
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update provider status (Verify/Reject)
// @route   PUT /api/admin/providers/:id/status
// @access  Private/Admin
const updateProviderStatus = async (req, res) => {
    try {
        const provider = await Provider.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        provider.status = req.body.status || provider.status;
        const updatedProvider = await provider.save();
        res.json(updatedProvider);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalProviders = await Provider.countDocuments();
        const pendingProviders = await Provider.countDocuments({ status: 'pending' });
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'active'] } });

        // Calculate Revenue (Sum of all completed booking amounts)
        const revenueData = await Booking.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const revenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Fetch Recent Bookings
        const recentBookingsRaw = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const recentBookings = recentBookingsRaw.map(b => ({
            id: b.bookingId || b._id.toString().slice(-6).toUpperCase(),
            user: b.userId?.name || 'Customer',
            provider: b.providerId?.shopName || 'Provider',
            service: b.serviceName || 'Service',
            amount: b.amount,
            status: b.status,
            date: new Date(b.createdAt).toLocaleDateString(),
            time: new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        res.json({
            totalProviders,
            pendingProviders,
            totalUsers,
            totalBookings,
            activeBookings,
            revenue,
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const bookings = await Booking.find(query)
            .populate('userId', 'name email mobile')
            .populate('providerId', 'shopName ownerName mobile')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ index: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new category
// @route   POST /api/admin/categories
// @access  Private/Admin
const addCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        Object.assign(category, req.body);
        const updated = await category.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Banner = require('../models/Banner');

// @desc    Get all banners
// @route   GET /api/admin/banners
// @access  Private/Admin
const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ priority: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new banner
// @route   POST /api/admin/banners
// @access  Private/Admin
const addBanner = async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete banner
// @route   DELETE /api/admin/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Banner removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle banner status
// @route   PATCH /api/admin/banners/:id/status
// @access  Private/Admin
const toggleBannerStatus = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });

        banner.active = !banner.active;
        const updated = await banner.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProviders,
    updateProviderStatus,
    getAdminStats,
    getBookings,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getUsers,
    getBanners,
    addBanner,
    deleteBanner,
    toggleBannerStatus
};
