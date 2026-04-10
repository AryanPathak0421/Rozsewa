const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Provider management
router.get('/providers', protect, admin, getProviders);
router.put('/providers/:id/status', protect, admin, updateProviderStatus);

// Category management
router.get('/categories', protect, admin, getCategories);
router.post('/categories', protect, admin, addCategory);
router.put('/categories/:id', protect, admin, updateCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);

// User management
router.get('/users', protect, admin, getUsers);

// Banner management
router.get('/banners', protect, admin, getBanners);
router.post('/banners', protect, admin, addBanner);
router.delete('/banners/:id', protect, admin, deleteBanner);
router.patch('/banners/:id/status', protect, admin, toggleBannerStatus);

// Dashboard stats
router.get('/stats', protect, admin, getAdminStats);

// Booking management
router.get('/bookings', protect, admin, getBookings);

module.exports = router;
