const express = require('express');
const router = express.Router();
const { createTicket, getProviderTickets } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/tickets', protect, createTicket);
router.get('/tickets', protect, getProviderTickets);

module.exports = router;
