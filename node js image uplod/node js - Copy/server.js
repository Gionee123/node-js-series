const express = require('express');
const cors = require('cors');//CORS इनेबल कर रहे हैं, ताकि फ्रंटएंड से API कॉल्स कर सकें।
const mongoose = require('mongoose');

const server = express();
server.use(cors());

server.use(express.json()); //  JSON डेटा को पार्स करने के लिए
server.use(express.urlencoded({ extended: true })); // URL-encoded डेटा को भी पार्स करने के लिए

server.use("/uploads/Images", express.static('uploads/Images')) //फोल्डर को स्टैटिक फोल्डर बना रहे हैं, ताकि इमेज को डायरेक्ट URL से एक्सेस कर सकें।
server.use("/uploads/Tabingcategory", express.static("uploads/Tabingcategory"))

server.get('/', (request, response) => {
    response.send('Server Working Fine.....');
})

require('./src/routes/backend/images.routes')(server); //images.routes.js में सभी इमेज अपलोड और व्यू से जुड़े रूट्स होंगे।
//ये server में रजिस्टर हो जाएंगे।
require('./src/routes/backend/two.images.routes')(server); //images.routes.js में सभी इमेज 

server.get('*', (request, response) => {
    response.send('Page not found.....');
})


mongoose.connect('mongodb+srv://yogeshsainijpr123:naveen12324@cluster0.yqvah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(
    () => {
        server.listen('5000', () => {
            console.log('Database Connected!');
        });
    }).catch((error) => {
        console.log('Database Not Connected!' + error);
    });