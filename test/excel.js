var mongoose = require('mongoose');
var mongodb = require('../config/mongodb.js');
mongodb();
let XLSX = require("xlsx");
var product_list = require('../models/product_list');
let workbook = XLSX.readFile("/home/cloudpool/Downloads/result_sl_lt.xlsx")
let worksheet = workbook.Sheets["Sheet1"]

// 행의갯수만큼 반복 , 열의갯수만큼 알파벳추가
for(let i = 1; i <= 9907; i++){
  var product = new product_list();
  // console.log(i);
  // console.log(worksheet["D" + 4680]);
  try{
    product.prd_id = i;
    product.prd_Name= worksheet["A" + i].v;
    product.prd_Price= worksheet["B" + i].v;
    product.prd_1st= worksheet["C" + i].v;
    product.prd_2nd= worksheet["D" + i].v;
    product.prd_3rd= worksheet["E" + i].v;
    product.prd_Brand= worksheet["F" + i].v;
    product.prd_REF= worksheet["G" + i].v;
    product.prd_Brandref= worksheet["H" + i].v;
    product.prd_SLURL= worksheet["J" + i].v;
    product.prd_SSGURL= worksheet["K" + i].v;
    product.prd_IMGURL= worksheet["L" + i].v;
    product.prd_ProductURL= worksheet["M" + i].v;
    product.createdAt= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product.updatedAt= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product.save(function(err){
      if(err){
      console.log(i+"'s error is"+err);
      }
      console.log("FINISH MAKE "+i+"th PRODUCT");
    })
  }
  catch(e){
    console.log("===========================Some error in"+i+"=====================================");
  }
}
// product_list.find({
//   prd_3th: '바디 워시'
// }, function(err, product_list) {
//   console.log(product_list);
// })
// product_list.find({
// prd_3th: '바디 워시'
// }).limit(3)
//     .exec(function (err, doc) {
//         console.log(doc);
//     });


// product_list.count({
//   prd_3th: '스킨/토너'
// }, function(err,count){
//   console.log(count);
// })
