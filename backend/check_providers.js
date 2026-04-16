const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Provider = require('./models/Provider');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkProviders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const providers = await Provider.find({ status: 'verified' });
        console.log(`Total Verified Providers: ${providers.length}`);

        providers.forEach(p => {
            console.log(`- ${p.shopName} (${p._id}): Online=${p.isOnline}, Location=${JSON.stringify(p.location)}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkProviders();
