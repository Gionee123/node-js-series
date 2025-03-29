const imageModel = require('../../models/images.scema')

// single image
exports.create = async (request, response) => {
    console.log(request.body)//request.body में टेक्स्ट डेटा आएगा (जैसे name)।
    console.log(request.files) //request.file में अपलोड की गई इमेज का डेटा होगा।

    var data = new imageModel({
        name: request.body.name,
    });
    if (request.file != undefined) {
        if (request.file.filename != "") {
            data.imageUrl = request.file.filename;
        }
        //अगर request.file मौजूद है (undefined नहीं है), तो आगे चेक करेंगे।
        //फिर अगर filename खाली नहीं है, तो इसे imageUrl में सेव कर देंगे।

        //इसका फायदा:
        //अगर कोई इमेज अपलोड नहीं हुई, तो कोड क्रैश नहीं होगा।
        //केवल वैध इमेज फाइल को ही सेव किया जाएगा।

    }
    await data.save() //data.save() से MongoDB में डेटा सेव कर रहे हैं।
        .then((result) => {
            //अगर सेव सफल हुआ, तो 201 (Created) स्टेटस के साथ JSON रिस्पॉन्स देंगे।
            response.status(201).json({
                success: true,
                message: "Category created successfully!",
                data: result
            });
        })
        .catch((error) => {
            //अगर कोई एरर आया, तो 500 (Internal Server Error) के साथ एरर मैसेज भेजेंगे।
            response.status(500).json({
                success: false,
                message: "Error creating category!",
                error: error.message
            });
        });
};
exports.view = async (request, response) => {
    try {
        const categories = await imageModel.find(); // imageModel.find() के जरिए सभी डेटा फेच कर रहे हैं।
        response.status(200).json({ // डेटा मिल गया, तो 200 (OK) स्टेटस के साथ JSON रिस्पॉन्स देंगे।
            success: true,
            message: "Categories fetched successfully!",
            imagepath: "http://localhost:5000/uploads/images/",
            data: categories
        });
    } catch (error) {
        //कोई एरर आया, तो 500 स्टेटस के साथ एरर दिखाएंगे।
        response.status(500).json({
            success: false,
            message: "Error fetching categories!",
            error: error.message
        });
    }

}