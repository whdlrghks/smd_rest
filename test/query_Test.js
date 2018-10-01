var mongoose = require('mongoose');
var mongodb = require('../config/mongodb.js');
mongodb();

var product_list = require('../models/product_list_test');
var timestamp2= new Date().getTime();

product_list.find({
  prd_SSGURL:  { $ne : "42"},
  prd_SLURL:  { $ne : "42"}
}, function(err,list){
  for(var i = 0 ; i < 300 ; i ++){
    console.log(list[i].prd_Name);
  }

})


// product_list.find( {} , { "_id":false, "prd_Name": true, "prd_Brand": true } , function(err, list){
//   var productname_list=[];
//   var productbrand_list=[];
//   for (var i = 0 ; i < list.length-1 ; i++){
//     productname_list[i] = list[i].prd_Name;
//     productbrand_list[i] = list[i].prd_Brand;
//   }
//
//   var result = productname_list.concat(productbrand_list)
//
//   let single = result.reduce(( a, b ) => {
//     if( a.indexOf(b) < 0 ) a.push(b) ;
//     return a ;
//   }, []) ; // <-- 초기값 빈 배열 세팅!
//   console.log('Check time with product_list_test ', new Date().getTime() - timestamp2, 'ms');
// })
// product_list.find({
//   _id: '5b964f1581b5b0184b13ae30'
// }, function(err, product_list) {
//   console.log(product_list);
//
// })
