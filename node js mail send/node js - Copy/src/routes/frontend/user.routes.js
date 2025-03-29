const express = require('express')
const route = express.Router();
const usercontroller = require("../../controllers/frontend/users.controller");

module.exports = app => {
    route.post('/send-mail', usercontroller.sendMail);

    app.use('/api/frontend/users', route)
}