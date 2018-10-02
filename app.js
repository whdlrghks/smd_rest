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
var list;
var product_list = require('./models/product_list');
var timestamp2= new Date().getTime();
product_list.find( {} , { "_id":false, "prd_Name": true, "prd_Brand": true } , function(err, list){
  var productname_list=[];
  var productbrand_list=[];
  for (var i = 0 ; i < list.length-1 ; i++){
    productname_list[i] = list[i].prd_Name;
    productbrand_list[i] = list[i].prd_Brand;
  }

  var result = productname_list.concat(productbrand_list)

  list = result.reduce(( a, b ) => {
    if( a.indexOf(b) < 0 ) a.push(b) ;
    return a ;
  }, []) ; // <-- 초기값 빈 배열 세팅!
  console.log('Check time with product_list_test ', new Date().getTime() - timestamp2, 'ms');
  var auth_router = require('./routes/auth_router')(app);
  var python_router = require('./routes/python_router')(app);
  var product_router = require('./routes/product_router')(app,list);
})



// // [CONFIGURE ROUTER] - 스키마 전달
// var router = require('./routes')(app,Book);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});
