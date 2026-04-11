const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Provider = require('../models/Provider');
const Employee = require('../models/Employee');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { providerId, serviceName, serviceId, bookingDate, bookingTime, totalAmount, address, couponCode, discountAmount, paymentMode } = req.body;

    try {
        const booking = await Booking.create({
            userId: req.user._id,
            providerId,
            serviceName,
            serviceId,
            bookingDate,
            bookingTime,
            totalAmount,
            address,
            location: req.body.location,
            couponCode,
            discountAmount,
            paymentMode
        });

        if (booking) {
            console.log(`Booking Created: ID=${booking._id}, Provider=${providerId}, User=${req.user._id}`);
            // Send Notification to Provider
            await Notification.create({
                recipientId: providerId,
                recipientModel: 'Provider',
                title: 'New Booking Received!',
                message: `You have a new booking for ${serviceName} on ${bookingDate} at ${bookingTime}.`,
                type: 'booking',
                bookingId: booking._id
            });
            console.log(`Notification sent to Provider: ${providerId}`);

            res.status(201).json(booking);
        } else {
            res.status(400).json({ message: 'Invalid booking data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (cancel/reschedule)
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking && booking.userId.toString() === req.user._id.toString()) {
            const { status, bookingDate, bookingTime } = req.body;

            booking.status = status || booking.status;
            booking.bookingDate = bookingDate || booking.bookingDate;
            booking.bookingTime = bookingTime || booking.bookingTime;

            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/bookings/provider
// @access  Private (Provider)
const getProviderBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ providerId: req.user._id })
            .populate('userId', 'ownerName name mobile address') // Populate user details
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status by provider (Accept/Started/Completed)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Provider)
const updateBookingStatusByProvider = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            if (booking.providerId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized for this booking' });
            }

            const newStatus = req.body.status || booking.status;

            // Generate OTP if status is changed to 'on_the_way'
            if (newStatus === 'on_the_way' && !booking.startOTP) {
                const otp = Math.floor(1000 + Math.random() * 9000).toString();
                booking.startOTP = otp;

                // Notify Provider with OTP
                await Notification.create({
                    recipientId: req.user._id,
                    recipientModel: 'Provider',
                    title: 'Start OTP Generated',
                    message: `Customer OTP to START service #${booking._id.toString().slice(-6)} is: ${otp}.`,
                    type: 'system',
                    bookingId: booking._id
                });
            }

            // Generate End OTP if Provider tries to complete but needs verification
            if (newStatus === 'completed' && booking.status === 'started' && !booking.endOTP) {
                const otp = Math.floor(1000 + Math.random() * 9000).toString();
                booking.endOTP = otp;
                await booking.save();

                return res.json({
                    message: 'Completion OTP generated. Share this with customer to finish.',
                    endOTP: otp,
                    status: 'started' // Keep as started until verified
                });
            }

            booking.status = newStatus;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP and start booking
// @route   POST /api/bookings/:id/start
// @access  Private (Provider)
const verifyStartOTP = async (req, res) => {
    const { otp } = req.body;
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            // Allow both User and Provider to verify
            const isAuthorized =
                booking.providerId.toString() === req.user._id.toString() ||
                booking.userId.toString() === req.user._id.toString();

            if (!isAuthorized) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (booking.startOTP === otp) {
                booking.status = 'started';
                await booking.save();
                res.json({ message: 'Service started successfully', status: 'started' });
            } else {
                res.status(400).json({ message: 'Invalid OTP' });
            }
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify End OTP and complete booking
// @route   POST /api/bookings/:id/complete
// @access  Private (Provider)
const verifyEndOTP = async (req, res) => {
    const { otp } = req.body;
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            const isAuthorized = booking.providerId.toString() === req.user._id.toString() ||
                booking.userId.toString() === req.user._id.toString();
            if (!isAuthorized) return res.status(401).json({ message: 'Not authorized' });

            if (booking.endOTP === otp) {
                // Update Provider stats and Commission logic
                const provider = await Provider.findById(booking.providerId);

                let adminCommission = 0;
                let providerPayout = booking.totalAmount;
                let commissionStatus = 'free';

                if (provider.freeServicesLeft > 0) {
                    provider.freeServicesLeft -= 1;
                } else {
                    const rate = provider.commissionRate || 10;
                    adminCommission = (booking.totalAmount * rate) / 100;
                    providerPayout = booking.totalAmount - adminCommission;
                    commissionStatus = 'commissioned';
                }

                // Update booking with commission details
                booking.status = 'completed';
                booking.adminCommission = adminCommission;
                booking.providerPayout = providerPayout;
                booking.commissionStatus = commissionStatus;

                // Update provider wallet
                provider.walletBalance += providerPayout;

                await Promise.all([booking.save(), provider.save()]);

                res.json({
                    message: 'Service completed successfully',
                    status: 'completed',
                    payout: providerPayout,
                    commission: adminCommission
                });
            } else {
                res.status(400).json({ message: 'Invalid OTP' });
            }
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get provider reviews
const getProviderReviews = async (req, res) => {
    try {
        const bookings = await Booking.find({
            providerId: req.user._id,
            rating: { $gt: 0 }
        }).populate('userId', 'name profileImage');

        const reviews = bookings.map(b => ({
            _id: b._id,
            user: b.userId?.name || 'Customer',
            profileImage: b.userId?.profileImage,
            service: b.serviceName,
            rating: b.rating,
            review: b.comment,
            date: b.createdAt
        }));

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getProviderBookings,
    updateBooking,
    updateBookingStatusByProvider,
    verifyStartOTP,
    verifyEndOTP,
    getProviderReviews
};
