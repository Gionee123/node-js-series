const coursesModel = require('../../models/courses.schema');


exports.create = async (request, response) => {
    data = new coursesModel({
        name: request.body.name,
        price: request.body.price,
        image: request.body.image,
        duration: request.body.duration,
        description: request.body.description,
        status: request.body.status ?? 1,
        order: request.body.order ?? 1,
    });



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

    var condition = {
        deleted_at: null
    }

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

    // const totalRecords = await coursesModel.find(condition).countDocuments(); //countDocuments()  की संख्या को count करने के लिए उपयोग किया जाता है।

    // const totalPriceSum = await coursesModel.aggregate(
    //     [{
    //         $group: {
    //             _id: null,
    //             totalSum: {
    //                 //$sum operator का उपयोग करके price field के values का योग निकाला जाता है।
    //                 $sum: '$price'
    //             }
    //         }
    //     }]
    // );

    // const avgPrice = await coursesModel.aggregate(
    //     [{
    //         $group: {
    //             _id: null,
    //             totalAvg: {
    //                 $avg: '$price' //$avg operator का उपयोग करके price field के values का average निकाला जाता है।

    //             }
    //         }
    //     }]
    // );

    // const minPrice = await coursesModel.aggregate(
    //     [{
    //         $group: {
    //             _id: null,
    //             totalmin: {
    //                 $min: '$price' //$min operator का उपयोग करके price field का minimum value निकाला जाता है।

    //             }
    //         }
    //     }]
    // );

    // const maxPrice = await coursesModel.aggregate(
    //     [{
    //         $group: {
    //             _id: null,
    //             totalmax: {
    //                 $max: '$price' // $max operator का उपयोग करके price field का maximum value निकाला जाता है।

    //             }
    //         }
    //     }]
    // );

    // kae he api sbahi ka data
    const totalCalclulation = await coursesModel.aggregate(
        [{
            //$group stage का उपयोग करके सभी documents को एक group में treat किया जाता है।


            $group: {
                _id: null,
                //count: Total documents की संख्या।
                count: {
                    $sum: 1
                },
                //totalPriceSum: सभी documents के price field का योग।
                totalPriceSum: {
                    $sum: '$price'
                },
                //avgPrice: सभी documents के price field का average।
                avgPrice: {
                    $avg: '$price'
                },
                //minPrice: सभी documents के price field का minimum value।
                minPrice: {
                    $min: '$price'
                },
                //maxPrice: सभी documents के price field का maximum value।
                maxPrice: {
                    $max: '$price'
                }
            }
        }]
    );

    await coursesModel.find(condition)

        .then((result) => {
            if (result.length > 0) {
                var res = {
                    status: true,
                    message: 'Record found successfully !!',
                    totalCalclulation: totalCalclulation,
                    // totalPriceSum: totalPriceSum,
                    // avgPrice: avgPrice,
                    // minPrice: minPrice,
                    // maxPrice: maxPrice,
                    // totalRecords: totalRecords,
                    data: result
                }

                response.send(res);
            } else {
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

