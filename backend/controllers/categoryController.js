const Category = require('../models/Category');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getPublicCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ index: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPublicCategories };
