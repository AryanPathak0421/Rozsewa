const express = require('express');
const router = express.Router();
const {
    registerProvider,
    authProvider,
    getProviderProfile,
    updateProviderStatus,
    updateProviderProfile,
    getProviderStats,
    checkProviderExistence
} = require('../controllers/providerController');
const { getPublicCategories } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerProvider);
router.post('/login', authProvider);
router.post('/check-existence', checkProviderExistence);
router.get('/categories', getPublicCategories);

// Protected routes
router.get('/profile', protect, getProviderProfile);
router.put('/profile', protect, updateProviderProfile);
router.get('/stats', protect, getProviderStats);
router.patch('/status', protect, updateProviderStatus);

module.exports = router;
