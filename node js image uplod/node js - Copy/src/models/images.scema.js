const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String, // Store the URL of the image
        // required: true
    }
});

const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel;
