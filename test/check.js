var mongoose = require('mongoose');
var mongodb = require('../config/mongodb.js');
mongodb();
let XLSX = require("xlsx");
var product_list = require('../models/product_list');

// var iterifyArr = function(arr) {
//   var cur = 0;
//   arr.next = (function() {
//     return (++cur >= this.length) ? false : this[cur];
//   });
//   arr.prev = (function() {
//     return (--cur < 0) ? false : this[cur];
//   });
//   return arr;
// };
const fs = require('fs');



product_list.find({}, {
  "_id": false,
  "prd_Name": true,
  "prd_Brand": true
}, function(err, list) {
  var start = new Date();
  // list = iterifyArr(list);
  var productname_list='var prd_Name = [';
  var productbrand_list='var prd_Brand = [';
  for (var i = 0 ; i < list.length-1 ; i++){
    productname_list = productname_list + "," + list[i].prd_Name;
    productbrand_list = productbrand_list + "," + list[i].prd_Brand;
  }

  productname_list = productname_list + "];";
  productbrand_list = productbrand_list + "];";
  var end = new Date();
  console.log(end-start);
  // console.log(list);
  // 
  // fs.writeFileSync("productname_ver_01.txt", '\ufeff' + productname_list, {
  //   encoding: 'utf8'
  // });
  // fs.writeFileSync("productbrand_ver_01.txt", '\ufeff' + productbrand_list, {
  //   encoding: 'utf8'
  // });

})
