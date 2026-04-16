const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Provider = require('./models/Provider');

dotenv.config({ path: path.join(__dirname, '.env') });

const verifyRadius = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- RADIUS VERIFICATION ---');

        // Test Site: Lucknow (Hazratganj)
        const lucknowCoords = [80.9462, 26.8467];

        // Test Site: Far away (e.g. Kanpur)
        const kanpurCoords = [80.3319, 26.4499];

        const radiusInKm = 15;
        const radiusInRadians = radiusInKm / 6371;

        console.log(`\nScenario 1: Booking in Lucknow (15km radius)`);
        const lucknowProviders = await Provider.find({
            status: 'verified',
            isOnline: true,
            location: {
                $geoWithin: {
                    $centerSphere: [lucknowCoords, radiusInRadians]
                }
            }
        });
        console.log(`Found ${lucknowProviders.length} providers within 15km of Lucknow central.`);
        lucknowProviders.forEach(p => console.log(`- ${p.shopName}`));

        console.log(`\nScenario 2: Booking in Kanpur (15km radius)`);
        const kanpurProviders = await Provider.find({
            status: 'verified',
            isOnline: true,
            location: {
                $geoWithin: {
                    $centerSphere: [kanpurCoords, radiusInRadians]
                }
            }
        });
        console.log(`Found ${kanpurProviders.length} providers within 15km of Kanpur.`);
        kanpurProviders.forEach(p => console.log(`- ${p.shopName}`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyRadius();
