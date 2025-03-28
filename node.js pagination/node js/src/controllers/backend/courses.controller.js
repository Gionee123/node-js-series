const coursesModel = require('../../models/courses.schema');
var slugify = require('slugify')


exports.create = async (request, response) => {

    console.log(request.body);
    const baseSlug = slugify(request.body.name, {
        replacement: '-',  // स्पेस को "-" से बदल देता है।
        lower: true,      // सभी अक्षरों को lowercase में बदलता है।
        strict: true,     // विशेष (special) characters को हटा देता है।

    });
    // ✅ पहले से मौजूद Slug वाले रिकॉर्ड्स को ढूंढें
    const existingSlugs = await coursesModel.find({ slug: new RegExp(`^${baseSlug}(-[0-9]+)?$`) });

    let finalSlug = baseSlug;
    if (existingSlugs.length >= 1) {
        finalSlug = `${baseSlug}-${existingSlugs.length}`;
    }

    data = new coursesModel({
        name: request.body.name,
        slug: finalSlug,
        price: request.body.price,
        image: request.body.image,
        duration: request.body.duration,
        description: request.body.description,
        status: request.body.status,
        order: request.body.order,
    });



    //await data.save() डेटाबेस में नया रिकॉर्ड सेव (Save) करने का काम करता है।
    await data.save().then((result) => {
        var res = {
            status: true,
            message: 'Record create succussfully',
            data: result
        }

        response.send(res);
    }).catch((error) => {
        var error_messages = [];

        for (let field in error.errors) {
            // console.log(field);
            error_messages.push(error.errors[field].message);
        }

        var res = {
            status: false,
            message: 'Something went wrong',
            error_messages: error_messages
        }

        response.send(res);
    })
}




exports.view = async (request, response) => {

    let condition = {
        deleted_at: null //सिर्फ उन्हीं रिकॉर्ड्स को दिखाना है जो डिलीट नहीं किए गए हैं (Soft Delete का हिस्सा)।
    }

    // उदाहरण:अगर request.body.name = "JavaScript" है, तो यह "javascript", "JAVASCRIPT", "Java Script" जैसे नाम भी ढूंढेगा।
    if (request.body.name != undefined) {
        if (request.body.name != '') {
            condition.name = new RegExp(request.body.name, 'i');
        }
    }

    if (request.body.price != undefined) {
        if (request.body.price != '') {
            condition.price = request.body.price;
        }
    }

    // अगर duration = "month" है, तो "1 Month", "3 Months", "MONTHLY" जैसे रिजल्ट्स दिखाएगा।
    if (request.body.duration != undefined) {
        if (request.body.duration != '') {
            condition.duration = new RegExp(request.body.duration, 'i');
        }
    }

    if (request.body.status != undefined) {
        if (request.body.status != '') {
            condition.status = request.body.status;
        }
    }

    console.log(condition);

    // Count all courses
    const totalRecords = await coursesModel.find(condition).countDocuments();
    // Pagination parameters
    const page = parseInt(request.body.page) || 1;
    console.log(page)
    const limit = parseInt(request.body.limit) || 5;
    const skip = (page - 1) * limit;

    await coursesModel.find(condition)
        .sort({ _id: -1 }).
        skip(skip).limit(limit)  // नए डेटा को सबसे पहले दिखाने के लिए _id को Descending (-1) करें
        .then((result) => {
            //अगर रिकॉर्ड मिले (result.length > 0)
            if (result.length > 0) {
                var res = {
                    status: true,
                    message: 'Record found successfully !!',
                    totalRecords: totalRecords,
                    pagination: {
                        totalRecords: totalRecords,
                        page: page,
                        limit: limit,
                        skip: skip
                    },
                    data: result,
                }

                response.send(res);
            } else {
                //गर कोई रिकॉर्ड नहीं मिला (result.length === 0)
                var res = {
                    status: false,
                    message: 'No Record found !!',

                    data: ''
                }

                response.send(res);
            }
        }).catch((error) => {
            var res = {
                status: false,
                message: 'Something went wrong !!',
            }

            response.send(res);
        });


}


