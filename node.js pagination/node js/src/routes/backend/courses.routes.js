const express = require('express');
const route = express.Router();
const coursesController = require('../../controllers/backend/courses.controller')



module.exports = app => {


    route.post('/add', coursesController.create);

    route.post('/view', coursesController.view);



    app.use('/api/backend/courses', route);

}