const SupportTicket = require('../models/SupportTicket');

// @desc    Raise a support ticket
// @route   POST /api/support/tickets
// @access  Private
const createTicket = async (req, res) => {
    try {
        const { subject, description, category, priority } = req.body;
        const ticket = await SupportTicket.create({
            providerId: req.user._id,
            subject,
            description,
            category,
            priority
        });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get provider tickets
// @route   GET /api/support/tickets
// @access  Private
const getProviderTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ providerId: req.user._id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTicket,
    getProviderTickets
};
