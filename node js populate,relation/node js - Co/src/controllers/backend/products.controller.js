const productModel = require('../../models/product'); // Product मॉडल को इम्पोर्ट करें
const Category = require('../../models/category'); // Category मॉडल को इम्पोर्ट करें

exports.create = async (request, response) => {
    // request body से डेटा लेकर एक नया product डॉक्यूमेंट बनाएं
    const data = new productModel({
        name: request.body.name, // प्रोडक्ट का नाम
        image: request.body.image, // प्रोडक्ट की इमेज
        category_id: request.body.category_id, // कैटेगरी का ID (Category मॉडल से रेफरेंस)
        status: request.body.status, // प्रोडक्ट की स्थिति
        order: request.body.order, // प्रोडक्ट का ऑर्डर
    });

    // डेटा को डेटाबेस में सेव करें
    var output = await data.save().then((success) => {
        // यदि सेव सफल होता है, तो सफलता का रिस्पॉन्स भेजें
        var result = {
            status: true,
            message: 'Record found successfully.', // संदेश
            data: success // सेव किया गया डेटा
        };

        response.send(result); // रिस्पॉन्स भेजें
    }).catch((error) => {
        // यदि सेव में कोई एरर आता है, तो एरर मैसेज को इकट्ठा करें
        var error_messages = [];
        for (let field in error.errors) {
            error_messages.push(error.errors[field].message); // एरर मैसेज को ऐरे में जोड़ें
        }

        // एरर का रिस्पॉन्स भेजें
        var result = {
            status: false,
            message: 'Something went wrong !!', // संदेश
            error_message: error_messages // एरर मैसेज
        };

        response.send(result); // रिस्पॉन्स भेजें
    });
};

exports.view = async (request, response) => {
    try {
        // Product डेटा को fetch करें और `category_id` को पॉप्युलेट करें
        const productData = await productModel.find()
            .populate({
                path: 'category_id', // `category_id` फील्ड को पॉप्युलेट करें
                select: { '_id': 1, 'name': 1, 'image': 1 }, // केवल `_id`, `name`, और `image` फील्ड्स को सेलेक्ट करें
            })
            .exec(); // क्वेरी को एक्ज़िक्यूट करें

        // यदि डेटा मिलता है, तो सफलता का रिस्पॉन्स भेजें
        if (productData.length > 0) {
            const resp = {
                status: true,
                message: 'Record found successfully!', // संदेश
                data: productData // प्रोडक्ट डेटा
            };
            response.send(resp); // 200 OK
        } else {
            // यदि कोई डेटा नहीं मिलता है, तो एरर का रिस्पॉन्स भेजें
            const resp = {
                status: false,
                message: 'No record found!' // संदेश
            };
            response.send(resp); // 404 Not Found
        }
    } catch (error) {
        // यदि कोई एरर आता है, तो उसे कंसोल पर लॉग करें और क्लाइंट को एरर मैसेज भेजें
        console.error(error); // एरर को लॉग करें
        const resp = {
            status: false,
            message: 'Something went wrong!', // संदेश
            error: error.message // एरर का विवरण
        };
        response.send(resp); // 500 Internal Server Error
    }
};

