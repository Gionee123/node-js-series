const mongoose = require('mongoose');
const product = require('../models/product');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },

    image: {
        type: String,
        require: true,

    },
    status: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 1,
        min: 1,
        max: [1000, 'maxium limit reach']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: ''
    }

})
const Category = mongoose.model('Category', categorySchema); // Category ko capital me rekha hai
module.exports = Category;