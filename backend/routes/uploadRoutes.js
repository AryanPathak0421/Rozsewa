const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Public (for KYC during registration)
router.post('/', upload.single('image'), (req, res) => {
    if (req.file && req.file.path) {
        res.json({
            url: req.file.path,
            public_id: req.file.filename
        });
    } else {
        res.status(400).json({ message: 'Image upload failed' });
    }
});

module.exports = router;
