const Provider = require('../models/Provider');
const generateToken = require('../utils/generateToken');
const Employee = require('../models/Employee');

// @desc    Register a new provider
// @route   POST /api/provider/register
// @access  Public
const registerProvider = async (req, res) => {
    const {
        mobile, ownerName, shopName, password, businessType, vendorType, subServices, profileImage, address, city, state,
        gst, kycAadhaar, kycAadhaarPhoto, kycPanPhoto, referralCode, employeeCode, registrationType, referredBy
    } = req.body;

    try {
        const providerExists = await Provider.findOne({ mobile });

        if (providerExists) {
            return res.status(400).json({ message: 'Provider already exists with this mobile number' });
        }

        // Generate a random vendor code RSVND + 5 digits
        const vendorCode = "RSVND" + Math.floor(10000 + Math.random() * 90000);

        // Core dynamic logic for First 3 Free services & Payouts
        let freeServicesLeft = 3; // Always 3 free for new vendors per request

        // Handle referral logic
        if (registrationType === 'vendor_referral' && referredBy) {
            // Find referring vendor and give them 3 more free services
            const referringVendor = await Provider.findOne({ vendorCode: referredBy });
            if (referringVendor) {
                referringVendor.freeServicesLeft = (referringVendor.freeServicesLeft || 0) + 3;
                await referringVendor.save();
                console.log(`Referral Bonus: 3 free services added to Provider ${referringVendor.vendorCode}`);
            } else {
                console.log(`Warning: Referring vendor ${referredBy} not found.`);
            }
        } else if (registrationType === 'employee' && referredBy) {
            // Find employee and update stats
            const employee = await Employee.findOne({ employeeId: referredBy });
            if (employee) {
                employee.referralCount = (employee.referralCount || 0) + 1;
                employee.totalEarnings = (employee.totalEarnings || 0) + (employee.registrationCommission || 50);
                await employee.save();
                console.log(`Employee Bonus: Commission added to Employee ${employee.employeeId}`);
            } else {
                console.log(`Warning: Referring employee ${referredBy} not found.`);
            }
        }

        // Prepare initial documents array from registration data
        const initialDocs = [];
        if (kycAadhaarPhoto) initialDocs.push({ id: 'aadhaar', url: kycAadhaarPhoto, status: 'pending', fileName: 'Aadhaar_Registration.jpg' });
        if (kycPanPhoto) initialDocs.push({ id: 'pan', url: kycPanPhoto, status: 'pending', fileName: 'PAN_Registration.jpg' });
        if (gst) initialDocs.push({ id: 'gst', url: gst, status: 'pending', fileName: 'GST_Registration.jpg' });

        const provider = await Provider.create({
            mobile,
            ownerName,
            shopName,
            password: password || "123456",
            businessType,
            vendorType,
            subServices,
            profileImage,
            vendorCode,
            address,
            city,
            state,
            gst,
            kycAadhaar,
            kycAadhaarPhoto,
            kycPanPhoto,
            referralCode,
            employeeCode,
            registrationType: registrationType || 'individual',
            referredBy: referredBy || null,
            freeServicesLeft,
            documents: initialDocs,
            location: req.body.location,
            status: 'pending' // Verification required by admin
        });

        if (provider) {
            res.status(201).json({
                _id: provider._id,
                ownerName: provider.ownerName,
                mobile: provider.mobile,
                shopName: provider.shopName,
                status: provider.status,
                vendorCode: provider.vendorCode,
                vendorType: provider.vendorType,
                businessType: provider.businessType,
                freeServicesLeft: provider.freeServicesLeft,
                token: generateToken(provider._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid provider data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth provider & get token
// @route   POST /api/provider/login
// @access  Public
const authProvider = async (req, res) => {
    const { mobile, password } = req.body;

    try {
        const provider = await Provider.findOne({ mobile });

        if (provider && (await provider.matchPassword(password))) {
            res.json({
                _id: provider._id,
                ownerName: provider.ownerName,
                shopName: provider.shopName,
                mobile: provider.mobile,
                status: provider.status,
                vendorCode: provider.vendorCode,
                vendorType: provider.vendorType,
                businessType: provider.businessType,
                freeServicesLeft: provider.freeServicesLeft,
                role: 'provider',
                token: generateToken(provider._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid mobile or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get provider profile
// @route   GET /api/provider/profile
// @access  Private (Provider)
const getProviderProfile = async (req, res) => {
    try {
        const provider = await Provider.findById(req.user._id);

        if (provider) {
            // Auto-sync legacy documents to the new array if it's empty
            if (!provider.documents || provider.documents.length === 0) {
                let changed = false;
                if (provider.kycAadhaarPhoto) { provider.documents.push({ id: 'aadhaar', url: provider.kycAadhaarPhoto, status: 'pending', fileName: 'Aadhaar_Registration.jpg' }); changed = true; }
                if (provider.kycPanPhoto) { provider.documents.push({ id: 'pan', url: provider.kycPanPhoto, status: 'pending', fileName: 'PAN_Registration.jpg' }); changed = true; }
                if (provider.gst && provider.gst.startsWith('http')) { provider.documents.push({ id: 'gst', url: provider.gst, status: 'pending', fileName: 'GST_Registration.jpg' }); changed = true; }

                if (changed) await provider.save();
            }

            // Fix for existing providers: If they are verified, their registration docs should be marked verified
            if (provider.status === 'verified') {
                let statusFixed = false;
                provider.documents.forEach(doc => {
                    if (doc.status === 'pending') {
                        doc.status = 'verified';
                        statusFixed = true;
                    }
                });
                if (statusFixed || !provider.kycVerified) {
                    provider.kycVerified = true;
                    await provider.save();
                }
            }
            res.json(provider);
        } else {
            res.status(404).json({ message: 'Provider not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update provider status (Online/Emergency)
// @route   PATCH /api/provider/status
// @access  Private (Provider)
const updateProviderStatus = async (req, res) => {
    const { isOnline, isEmergencyEnabled } = req.body;

    try {
        const provider = await Provider.findById(req.user._id);

        if (provider) {
            if (isOnline !== undefined) provider.isOnline = isOnline;
            if (isEmergencyEnabled !== undefined) provider.isEmergencyEnabled = isEmergencyEnabled;

            await provider.save();
            res.json({
                message: 'Status updated',
                isOnline: provider.isOnline,
                isEmergencyEnabled: provider.isEmergencyEnabled
            });
        } else {
            res.status(404).json({ message: 'Provider not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update provider profile
// @route   PUT /api/provider/profile
// @access  Private (Provider)
const updateProviderProfile = async (req, res) => {
    try {
        const provider = await Provider.findById(req.user._id);

        if (provider) {
            provider.ownerName = req.body.ownerName || provider.ownerName;
            provider.shopName = req.body.shopName || provider.shopName;
            provider.email = req.body.email || provider.email;
            provider.vendorType = req.body.category || req.body.vendorType || provider.vendorType;
            provider.address = req.body.address || provider.address;
            provider.profileImage = req.body.profileImage || provider.profileImage;

            if (req.body.location) {
                provider.location = req.body.location;
            }

            const updatedProvider = await provider.save();

            res.json({
                _id: updatedProvider._id,
                ownerName: updatedProvider.ownerName,
                shopName: updatedProvider.shopName,
                mobile: updatedProvider.mobile,
                vendorCode: updatedProvider.vendorCode,
                vendorType: updatedProvider.vendorType,
                address: updatedProvider.address,
                profileImage: updatedProvider.profileImage,
                token: generateToken(updatedProvider._id),
            });
        } else {
            res.status(404).json({ message: 'Provider not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get provider earnings stats
// @route   GET /api/provider/stats
// @access  Private (Provider)
const getProviderStats = async (req, res) => {
    try {
        const Booking = require('../models/Booking');
        const bookings = await Booking.find({
            providerId: req.user._id,
            status: 'completed'
        });

        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let todayEarnings = 0;
        let weekEarnings = 0;
        let monthEarnings = 0;

        bookings.forEach(b => {
            const bDate = new Date(b.createdAt);
            const amt = b.totalAmount || 0;

            if (bDate >= startOfDay) todayEarnings += amt;
            if (bDate >= startOfWeek) weekEarnings += amt;
            if (bDate >= startOfMonth) monthEarnings += amt;
        });

        res.json({
            today: todayEarnings,
            week: weekEarnings,
            month: monthEarnings,
            totalBookings: bookings.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if provider exists
// @route   POST /api/provider/check-existence
// @access  Public
const checkProviderExistence = async (req, res) => {
    const { mobile } = req.body;
    try {
        const provider = await Provider.findOne({ mobile });
        res.json({ exists: !!provider });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload KYC Document
// @route   POST /api/provider/documents
// @access  Private (Provider)
const uploadDocument = async (req, res) => {
    try {
        const { docId } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const provider = await Provider.findById(req.user._id);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        // Check if document of this type already exists
        const docIndex = provider.documents.findIndex(d => d.id === docId);

        const newDoc = {
            id: docId,
            url: req.file.path,
            status: 'pending',
            fileName: req.file.originalname,
            uploadedAt: Date.now()
        };

        if (docIndex > -1) {
            provider.documents[docIndex] = newDoc;
        } else {
            provider.documents.push(newDoc);
        }

        await provider.save();

        res.json({
            message: 'Document uploaded successfully',
            document: newDoc
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerProvider,
    authProvider,
    getProviderProfile,
    updateProviderStatus,
    updateProviderProfile,
    getProviderStats,
    checkProviderExistence,
    uploadDocument,
};
