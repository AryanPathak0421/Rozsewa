const express = require('express');
const router = express.Router();
const { getPublicBanners, getPublicCategories, getFeaturedProviders, getPublicProviders, getPublicConfig, getPublicServiceByProvider, getPublicProviderById, getPublicCategoryByName, getPublicCoupons, validateCoupon } = require('../controllers/homeController');

router.get('/banners', getPublicBanners);
router.get('/categories', getPublicCategories);
router.get('/categories/:name', getPublicCategoryByName);
router.get('/featured-providers', getFeaturedProviders);
router.get('/providers', getPublicProviders);
router.get('/providers/:id', getPublicProviderById);
router.get('/services/:providerId', getPublicServiceByProvider);
router.get('/coupons', getPublicCoupons);
router.post('/coupons/validate', validateCoupon);
router.get('/config', getPublicConfig);

module.exports = router;
