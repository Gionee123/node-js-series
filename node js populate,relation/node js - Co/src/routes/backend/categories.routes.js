
const express = require('express');
const route = express.Router();
const categoryController = require('../../controllers/backend/categories.controller')

module.exports = app => {

    route.post('/add', categoryController.create);

    route.post('/view', categoryController.view);




    app.use('/api/backend/categories', route);

}