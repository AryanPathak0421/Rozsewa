const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, updateUserProfile, deleteUserAccount, updatePassword, checkUserExistence } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/check-existence', checkUserExistence);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserAccount);
router.put('/password', protect, updatePassword);

module.exports = router;
