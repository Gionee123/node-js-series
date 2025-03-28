const coursesModel = require('../../models/courses.schema');


exports.create = async (request, response) => {

    console.log(request.body);
    // console.log(request.file);

    data = new coursesModel({
        name: request.body.name,
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
    await coursesModel.find(condition)
        .sort({ _id: -1 })  // नए डेटा को सबसे पहले दिखाने के लिए _id को Descending (-1) करें
        .then((result) => {
            //अगर रिकॉर्ड मिले (result.length > 0)
            if (result.length > 0) {
                var res = {
                    status: true,
                    message: 'Record found successfully !!',
                    data: result
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
exports.search = async (request, response) => {

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
    await coursesModel.find({
        //👉 यह $or ऑपरेटर का उपयोग कर रहा है, जिसका मतलब है कि
        //अगर नाम (name) या (duration) मिलती है,तो रिकॉर्ड को रिजल्ट में शामिल करें।
        $or: [
            { name: { $regex: condition.name, $options: "i" } },
            { duration: { $regex: condition.duration, $options: "i" } }
        ]
    })
        .sort({ _id: -1 })  // नए डेटा को सबसे पहले दिखाने के लिए _id को Descending (-1) करें
        .then((result) => {
            //अगर रिकॉर्ड मिले (result.length > 0)
            if (result.length > 0) {
                var res = {
                    status: true,
                    message: 'Record found successfully !!',
                    data: result
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


