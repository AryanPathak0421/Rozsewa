const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const Provider = require('./models/Provider');
const Service = require('./models/Service');
const Category = require('./models/Category');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected to DB");

    const p = await Provider.findOne({
        $or: [
            { name: /XYZ/i },
            { shopName: /XYZ/i },
            { ownerName: /XYZ/i }
        ]
    }).populate('vendorType');

    if (!p) {
        console.log("Provider XYZ not found");
        process.exit(0);
    }

    console.log("Provider Found:", {
        id: p._id,
        shopName: p.shopName,
        status: p.status,
        vendorType: p.vendorType?.name,
        businessType: p.businessType
    });

    const services = await Service.find({ providerId: p._id });
    console.log(`Found ${services.length} services for XYZ:`);
    services.forEach(s => {
        console.log("Service Detail:", JSON.stringify(s, null, 2));
    });

    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
