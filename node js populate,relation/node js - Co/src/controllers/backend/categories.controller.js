const categoryModel = require('../../models/category');

exports.create = async (request, response) => {
    // request body से डेटा लेकर एक नया category डॉक्यूमेंट बनाएं
    const data = new categoryModel({
        name: request.body.name, // नाम
        image: request.body.image, // इमेज
        status: request.body.status, // स्थिति
        order: request.body.order, // ऑर्डर
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
    // डिफ़ॉल्ट कंडीशन: केवल उन्हीं डॉक्यूमेंट्स को फ़िल्टर करें जिनका `deleted_at` null है
    const addCondition = [{
        deleted_at: null,
    }];

    // OR कंडीशन के लिए एक खाली ऐरे बनाएं
    const orCondition = [];

    // यदि request body में `order` है और यह खाली नहीं है, तो इसे OR कंडीशन में जोड़ें
    if (request.body.order != undefined) {
        if (request.body.order != '') {
            orCondition.push({ order: request.body.order });
        }
    }

    // यदि request body में `name` है और यह खाली नहीं है, तो इसे OR कंडीशन में जोड़ें
    if (request.body.name != undefined) {
        if (request.body.name != '') {
            orCondition.push({ name: new RegExp(request.body.name, "i") }); // नाम को केस-इनसेंसिटिव तरीके से खोजें
        }
    }

    // यदि `addCondition` में कोई कंडीशन है, तो उसे फ़िल्टर में जोड़ें
    if (addCondition.length > 0) {
        var filter = { $and: addCondition };
    } else {
        var filter = {}; // यदि कोई कंडीशन नहीं है, तो खाली फ़िल्टर बनाएं
    }

    // यदि `orCondition` में कोई कंडीशन है, तो उसे फ़िल्टर में जोड़ें
    if (orCondition.length > 0) {
        filter.$or = orCondition;
    }

    // फ़िल्टर का उपयोग करके डेटाबेस से डेटा fetch करें
    var categoryData = await categoryModel.find(filter);

    // एक अतिरिक्त क्वेरी: ऐसे डॉक्यूमेंट्स ढूंढें जिनका `order` फील्ड का टाइप 16 है (यह MongoDB में एक विशेष टाइप है)
    var newcategoryData = await categoryModel.find({
        order: {
            $type: 16 // टाइप 16 का मतलब है "32-bit integer"
        }
    });

    // यदि `newcategoryData` में डेटा मिलता है, तो सफलता का रिस्पॉन्स भेजें
    if (newcategoryData.length != 0) {
        var resp = {
            status: true,
            message: 'record found successfully !!', // संदेश
            data: newcategoryData // डेटा
        };

        response.send(resp); // रिस्पॉन्स भेजें
    } else {
        // यदि कोई डेटा नहीं मिलता है, तो एरर का रिस्पॉन्स भेजें
        var resp = {
            status: false,
            message: 'No record found !!' // संदेश
        };

        response.send(resp); // रिस्पॉन्स भेजें
    }
};





