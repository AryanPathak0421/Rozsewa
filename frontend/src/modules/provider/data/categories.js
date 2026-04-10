import {
    Scissors, Wrench, Home, UserCheck, Trash2, HeartPulse, Truck, Calendar,
    GraduationCap, Briefcase, Utensils, Car, Stethoscope, Droplets, Hotel,
    Flower2, HardHat, Hammer, AlertTriangle, Building2
} from "lucide-react";

export const categoriesData = [
    {
        id: "salon",
        label: "Salon & Grooming",
        icon: Scissors,
        services: [
            "Hair Cutting & Styling", "Beard Trimming & Shaving", "Hair Spa & Treatment",
            "Facial (Basic, Gold, Diamond, Bridal)", "Cleanup & Bleach", "Manicure & Pedicure",
            "Bridal Makeup", "Party Makeup", "Mehndi Service", "Waxing & Threading"
        ]
    },
    {
        id: "appliance",
        label: "AC & Appliance Repair",
        icon: Wrench,
        services: [
            "AC Installation & Repair", "RO Repair & Installation", "Refrigerator Repair",
            "Washing Machine Repair", "Geyser Repair", "Chimney Repair", "Microwave Repair",
            "Water Purifier Service", "Cooler Repair"
        ]
    },
    {
        id: "maintenance",
        label: "Home Maintenance",
        icon: Home,
        services: [
            "Electrician (Wiring, Light fitting)", "Plumber (Leakage, Tank repair)",
            "Carpenter (Door, Window repair)", "Furniture Assembly", "Painting (Int/Ext)",
            "Waterproofing", "Wall Makeover", "Decor installation"
        ]
    },
    {
        id: "pandit",
        label: "Pandit & Religious",
        icon: UserCheck,
        services: [
            "Pooja (Grih Pravesh, Satyanarayan)", "Havan", "Grih Shanti",
            "Marriage Pandit Booking", "Astrology Consultation", "Bhajan/Kirtan Arrangement"
        ]
    },
    {
        id: "cleaning",
        label: "Cleaning & Facility",
        icon: Trash2,
        services: [
            "Full Home Cleaning", "Bathroom Deep Cleaning", "Kitchen Deep Cleaning",
            "Sofa Cleaning", "Carpet Cleaning", "Office Cleaning",
            "Water Tank Cleaning", "Pest Control"
        ]
    },
    {
        id: "wellness",
        label: "Health & Wellness",
        icon: HeartPulse,
        services: [
            "Home Nurse", "Physiotherapist", "Lab Test at Home",
            "Yoga Trainer", "Personal Fitness Trainer", "Diet Consultant"
        ]
    },
    {
        id: "transport",
        label: "Transport & Delivery",
        icon: Truck,
        services: [
            "Bike Parcel Delivery", "Mini Truck Booking", "Tempo Booking",
            "Taxi Booking", "Auto Booking", "Bus Booking", "Travel Car Rental"
        ]
    },
    {
        id: "event",
        label: "Event & Occasion",
        icon: Calendar,
        services: [
            "Tent & Decoration", "Pre-wedding Shoot", "Wedding Planning",
            "Birthday Party Arrangement", "Catering Service", "DJ & Sound System",
            "Photographer", "Videographer"
        ]
    },
    {
        id: "education",
        label: "Education & Learning",
        icon: GraduationCap,
        services: [
            "Home Tutor (Class 1-12)", "Competitive Exams (SSC/Banking)",
            "Computer Training", "Spoken English", "Personality Development",
            "Digital Marketing / Coding", "Online Classes", "Skill Training"
        ]
    },
    {
        id: "professional",
        label: "Professional Services",
        icon: Briefcase,
        services: [
            "CA / Accountant", "GST Registration & Filing", "Income Tax Return",
            "Company Registration", "Legal Advisor (Property/Court)",
            "Insurance Agent", "Loan Agent", "Document Typing"
        ]
    },
    {
        id: "food",
        label: "Food & Daily Need",
        icon: Utensils,
        services: [
            "Tiffin Service", "Home Cook", "Grocery Delivery",
            "Milk Delivery", "Fruits & Vegetable Delivery",
            "Bakery Items Delivery", "Drinking Water Supply"
        ]
    },
    {
        id: "vehicle",
        label: "Vehicle (Bike & Car)",
        icon: Car,
        services: [
            "Bike Servicing & Washing", "Car Servicing & Washing",
            "Doorstep Washing", "Car Detailing", "Puncture Repair",
            "Home Pickup & Drop Service", "Self Drop Booking"
        ]
    },
    {
        id: "medical",
        label: "Medical & Doctor",
        icon: Stethoscope,
        services: [
            "Doctor Appointment", "Specialist Consultation", "Online Consultation",
            "Ambulance Booking", "Lab Test Booking", "Medicine Delivery",
            "Nursing Care"
        ]
    },
    {
        id: "water",
        label: "Mineral Water",
        icon: Droplets,
        services: [
            "20L Water Can Booking", "Water Jar Delivery",
            "Monthly Subscription", "Bulk Water Supply"
        ]
    },
    {
        id: "property",
        label: "Lodge & Property",
        icon: Hotel,
        services: [
            "Lodge / Hotel Booking", "PG Room Booking", "Office Space",
            "Shop on Rent", "Marriage Hall Booking", "Banquet Hall",
            "Restaurant Table Booking"
        ]
    },
    {
        id: "flower",
        label: "Flower & Decoration",
        icon: Flower2,
        services: [
            "Flower Bouquet", "Temple Flower Supply", "Event Flower Decor",
            "Wedding Decoration", "Car Flower Decoration", "Garlands (Mala)"
        ]
    },
    {
        id: "labour",
        label: "Labour & Hiring",
        icon: HardHat,
        services: [
            "Raj Mistri (Mason)", "Construction Helper", "Painter Team",
            "Daily Wage Workers", "Security Guard", "Maid / Cook",
            "Driver Hiring", "Delivery Boy Hiring"
        ]
    },
    {
        id: "construction",
        label: "Construction Material",
        icon: Hammer,
        services: [
            "Cement/Sand Supplier", "Gitti / Bricks Supply", "JCB Booking",
            "Tractor Booking", "Equipment Rental", "Water Tanker Supply"
        ]
    },
    {
        id: "emergency",
        label: "Emergency (24/7)",
        icon: AlertTriangle,
        services: [
            "Emergency Electrician", "Emergency Plumber", "Ambulance Booking",
            "Breakdown Assistance", "Roadside Help", "Locksmith"
        ]
    },
    {
        id: "propertydealer",
        label: "Property Dealer",
        icon: Building2,
        services: [
            "House Sell/Rent", "Flat / Apartment", "Plot / Land Sale",
            "Villa / Farm House", "Site Visit Arrangement", "Negotiation Support"
        ]
    }
];
