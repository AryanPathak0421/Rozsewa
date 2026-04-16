const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Provider = require('./models/Provider');

dotenv.config({ path: path.join(__dirname, '.env') });

const fixProviders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Default: Lucknow coordinates
        const defaultLng = 80.9462;
        const defaultLat = 26.8467;

        const result = await Provider.updateMany(
            {
                $or: [
                    { "location.coordinates": { $exists: false } },
                    { "location.coordinates": { $size: 0 } },
                    { "location.coordinates": [0, 0] }
                ]
            },
            {
                $set: {
                    location: {
                        type: "Point",
                        coordinates: [defaultLng, defaultLat]
                    }
                }
            }
        );

        console.log(`Updated ${result.modifiedCount} providers with default Lucknow coordinates.`);

        const providers = await Provider.find({ status: 'verified' });
        providers.forEach(p => {
            console.log(`- ${p.shopName}: ${JSON.stringify(p.location.coordinates)}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixProviders();
