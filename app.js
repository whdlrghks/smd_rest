// app.js
// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var mongodb     = require('./config/mongodb.js');


mongodb();
// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]
var port = 5050;

//스키마 생성
// var Book = require('./models/book')

var python_router = require('./routes/python_router')(app);
var product_router = require('./routes/product_router')(app);
// // [CONFIGURE ROUTER] - 스키마 전달
// var router = require('./routes')(app,Book);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});
