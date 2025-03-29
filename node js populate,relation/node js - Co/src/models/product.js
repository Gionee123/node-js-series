const mongoose = require('mongoose'); // Mongoose को इम्पोर्ट करें
const Category = require('../models/category'); // Category मॉडल को इम्पोर्ट करें

// Product के लिए स्कीमा डिफाइन करें
const productSchema = new mongoose.Schema({
    name: {
        type: String, // नाम का टाइप स्ट्रिंग है
        required: [true, 'Name is required'] // नाम आवश्यक है, और यदि नहीं दिया जाए तो एरर मैसेज दिखाएं
    },
    category_id: {
        type: mongoose.Types.ObjectId, // category_id का टाइप ObjectId है
        ref: "Category" // यह Category मॉडल के साथ रेफरेंस करता है
    },
    image: {
        type: String, // इमेज का टाइप स्ट्रिंग है
        required: true // इमेज आवश्यक है
    },
    status: {
        type: Boolean, // स्थिति का टाइप बूलियन है
        default: true // डिफ़ॉल्ट वैल्यू true है
    },
    order: {
        type: Number, // ऑर्डर का टाइप नंबर है
        default: 1, // डिफ़ॉल्ट वैल्यू 1 है
        min: 1, // न्यूनतम वैल्यू 1 है
        max: [1000, 'Maximum limit reached'] // अधिकतम वैल्यू 1000 है
    },
    created_at: {
        type: Date, // बनाए गए समय का टाइप डेट है
        default: Date.now // डिफ़ॉल्ट वैल्यू वर्तमान समय है
    },
    updated_at: {
        type: Date, // अपडेट किए गए समय का टाइप डेट है
        default: Date.now // डिफ़ॉल्ट वैल्यू वर्तमान समय है
    },
    deleted_at: {
        type: Date, // डिलीट किए गए समय का टाइप डेट है
        default: null // डिफ़ॉल्ट वैल्यू null है
    }
});

// Product मॉडल बनाएं
const Product = mongoose.model('products', productSchema);

// Product मॉडल को एक्सपोर्ट करें
module.exports = Product;