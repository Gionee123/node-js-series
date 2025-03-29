
const express = require('express');
const route = express.Router();
const productsController = require('../../controllers/backend/products.controller')

module.exports = app => {

    route.post('/add', productsController.create);

    route.post('/view', productsController.view);




    app.use('/api/backend/products', route);

}