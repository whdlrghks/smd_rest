var mongoose = require('mongoose');
var mongodb = require('../config/mongodb.js');
mongodb();
let XLSX = require("xlsx");

// var product_list = require('../models/product_list');
// let workbook = XLSX.readFile("/home/cloudpool/Downloads/result_sl_lt.xlsx")
// let worksheet = workbook.Sheets["Sheet1"]
//
// // 행의갯수만큼 반복 , 열의갯수만큼 알파벳추가
// for(let i = 1; i <= 9907; i++){
//   var product = new product_list();
//   // console.log(i);
//   // console.log(worksheet["D" + 4680]);
//   try{
//     product.prd_id = i;
//     product.prd_Name= worksheet["A" + i].v;
//     product.prd_Price= worksheet["B" + i].v;
//     product.prd_1st= worksheet["C" + i].v;
//     product.prd_2nd= worksheet["D" + i].v;
//     product.prd_3rd= worksheet["E" + i].v;
//     product.prd_Brand= worksheet["F" + i].v;
//     product.prd_REF= worksheet["G" + i].v;
//     product.prd_Brandref= worksheet["H" + i].v;
//     product.prd_SLURL= worksheet["J" + i].v;
//     product.prd_SSGURL= worksheet["K" + i].v;
//     product.prd_IMGURL= worksheet["L" + i].v;
//     product.prd_ProductURL= worksheet["M" + i].v;
//     product.createdAt= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//     product.updatedAt= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//     product.save(function(err){
//       if(err){
//       console.log(i+"'s error is"+err);
//       }
//       console.log("FINISH MAKE "+i+"th PRODUCT");
//     })
//   }
//   catch(e){
//     console.log("===========================Some error in"+i+"=====================================");
//   }

var product_list = require('../models/product_list_test');
// let workbook = XLSX.readFile("/Users/ikhwan/Downloads/result_sl_lt.xlsx")
// let worksheet = workbook.Sheets["Sheet1"]
var product_list_lt = require('../models/product_list_lt');
var product_list_sl = require('../models/product_list_sl');
var product_list_ssg = require('../models/product_list_ssg');
var async = require('async')
// let workbook = XLSX.readFile("/Users/ikhwan/Downloads/ssg_product_final.xlsx");
// let worksheet_ssg = workbook.Sheets["ssg_product_final"];
let workbook2 = XLSX.readFile("/Users/ikhwan/Downloads/prdInfo_shilla_comp.xlsx");
let worksheet = workbook2.Sheets["prdInfo_Shilla"];
// let workbook3 = XLSX.readFile("/Users/ikhwan/Downloads/prdInfo_Lotte_FINAL.xlsx");
// let worksheet_lt = workbook3.Sheets["prdInfo_Lotte_FINAL"];
var product_ssglist = new Array(5000);
var myArray;

for(let i = 10000; i <=40466; i++){
  var product = new product_list_sl();
  // console.log(i);
  // console.log(worksheet["D" + 4680]);
  try{
    product.prd_id = i;
    product.prd_Name= worksheet["A" + i].v;
    product.prd_Price= worksheet["B" + i].v;
    product.prd_Member_Price= worksheet["C" + i].v;
    product.prd_1st= worksheet["D" + i].v;
    product.prd_2nd= worksheet["E" + i].v;
    product.prd_3rd= worksheet["F" + i].v;
    product.prd_Brand_E= worksheet["G" + i].v;
    product.prd_Brand_K= worksheet["H" + i].v;
    var ref_raw =worksheet["I" + i].v;

    var ref="";
    if(ref_raw.match(/\//)){
      let split = ref_raw.split("/");
      if(split.length>1){
        var temp = split[0];
        if(temp.match(/REF/)){
          ref = split[0].replace("REF.NO ","");
        }
      }
      else{
        if(temp.match(/REF/)){
          ref = split[0].replace("REF.NO ","");
        }
        else{
          ref = ref_raw;
        }
      }
      ref = ref.replace(/(^\s*)|(\s*$)/, '');
    }
    else{
      ref = ref_raw;
    }

    // console.log("ref_raw : ",ref_raw,", ref: \"",ref,"\"");
    product.prd_REF=ref;
    product.prd_SLURL= worksheet["K" + i].v;
    product.prd_IMGURL= worksheet["J" + i].v;
    product.createdAt= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product.updatedAt= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product.save(function(err){
      if(err){
      console.log(i+"'s error is"+err);
      }
      console.log("FINISH MAKE SL "+i+"th PRODUCT");
    })
  }
  catch(e){
    console.log(e);
    console.log("===========================Some error SL in"+i+"=====================================");
  }
}
// SSG 20000개 부터 시작
// 행의갯수만큼 반복 , 열의갯수만큼 알파벳추가
// async.forEachOf(product_ssglist, function(product_ssg, index, callback_2) {
//   var i = index+45000;
//   var product = new product_list();
//   product_list_lt.find({
//     prd_id: i
//   }, {
//     "_id": false
//   }, function(err_lt, product_result) {
//     try {
//       var list = product_result[0];
//       save_product(list.prd_REF, true, product_list_sl)
//         .then(
//           function(sl_result) {
//             save_product(list.prd_REF, false, product_list_ssg)
//               .then(
//                 function(ssg_result) {
//                   // myArray[i][0]=sl_result;
//                   // myArray[i][1]=ssg_result;
//                   product.prd_id = i;
//                   product.prd_Name = list.prd_Name,
//                     product.prd_Price = list.prd_Price,
//                     product.prd_1st = list.prd_1st,
//                     product.prd_2nd = list.prd_2nd,
//                     product.prd_3rd = list.prd_3rd
//                   product.prd_Brand = list.prd_Brand,
//                     product.prd_REF = list.prd_REF,
//                   product.prd_SLURL = sl_result,
//                     product.prd_SSGURL = ssg_result,
//                     product.prd_ProductURL = list.prd_LTURL,
//                     product.prd_IMGURL = list.prd_IMGURL;
//                   product.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//                   product.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//                   product.save(function(err) {
//                     if (err) {
//                       console.log(i + "'s error is" + err);
//                     }
//                     console.log("FINISH MAKE " + i + "th LT PRODUCT");
//                     return callback_2();
//                   })
//
//
//                 }
//               )
//           }
//         )
//     }
//
//
//      catch (e) {
//        console.log(e);
//       console.log("===========================Some LT error in" + i + "=====================================");
//     }
//   })
// }, function(err, results_2) {
//   console.log("Finish ALL data");
// })
// for (let i = 0; i <= 30; i++) {
//
// }



function save_product(ref, flag, product_list) {
  return new Promise(
    function(resolve, reject) {
      product_list.find({
        prd_REF: ref
      }, {
        "_id": false,
        "prd_Name": false,
        "prd_Price": false,
        "prd_1st": false,
        "prd_2nd": false,
        "prd_3rd": false,
        "prd_Brand": false,
        "prd_REF": false,
        "prd_IMGURL": false
      }, function(err, product_save) {
        if (product_save[0]!=undefined){
          if (flag) {

            resolve(product_save[0].prd_SLURL);
          } else {
            resolve(product_save[0].prd_SSGURL);
          }
        } else {
          // console.log("!@#!@#!@#!@");
          // product_list.find({
          //   prd_Brand : list.prd_Brand,
          //   prd_Price : list.prd_Price
          // }, {
          //   "_id": false,
          //   "prd_Name": false,
          //   "prd_Price": false,
          //   "prd_1st": false,
          //   "prd_2nd": false,
          //   "prd_3rd": false,
          //   "prd_Brand": false,
          //   "prd_REF": false,
          //   "prd_IMGURL": false
          // },  function(err, product_save_price){
          //   if (product_save_price[0]!=undefined){
          //     if (flag) {
          //       resolve(product_save_price[0].prd_SLURL);
          //     } else {
          //       resolve(product_save_price[0].prd_SSGURL);
          //     }
          //   }
          //   else{
              resolve("42");
          //   }
          // });
        }
      });
    }
  )


}

// var product_LT = new product_list_lt();
//   var product = new product_list();
//   product.prd_id = i;
//   product.prd_Name = product_result.prd_Name
//   product.prd_Price = product_result.prd_Price
//   product.prd_1st = product_result.
//   product.prd_2nd = product_result.
//   product.prd_3rd = product_result.
//   product.prd_Brand = product_result.
//   product.prd_REF = product_result.
//   product.prd_SLURL = product_result.
//   product.prd_SSGURL = product_result.
//   product.prd_ProductURL = product_result.
//   product.prd_IMGURL = product_result.
//   product.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//   product.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//   product.save(function(err) {
//     if (err) {
//       console.log(i + "'s error is" + err);
//     }
//     console.log("FINISH MAKE " + i + "th LT PRODUCT");
//     // return callback_sub();
//   })
// } catch (e) {
//
//   // console.log("ERROR with SSG",i);
//   // return callback_sub();
//   console.log("===========================Some SSG error in" + i + "=====================================");
// }
// })

// console.log(i);
// console.log(worksheet["D" + 4680]);
// try {
//   // var product_LT = new product_list_lt();
//   var product_LT = new product_list_lt();
//   product_LT.prd_id = i;
//   product_LT.prd_Name = worksheet_lt["A" + i].v;
//   product_LT.prd_Price = worksheet_lt["B" + i].v;
//   product_LT.prd_1st = worksheet_lt["C" + i].v;
//   product_LT.prd_2nd = worksheet_lt["D" + i].v;
//   product_LT.prd_3rd = worksheet_lt["E" + i].v;
//   product_LT.prd_Brand = worksheet_lt["F" + i].v;
//   product_LT.prd_REF = worksheet_lt["G" + i].v;
//   product_LT.prd_LTURL = worksheet_lt["I" + i].v;
//   product_LT.prd_IMGURL = worksheet_lt["H" + i].v;
//   product_LT.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//   product_LT.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//   product_LT.save(function(err) {
//     if (err) {
//       console.log(i + "'s error is" + err);
//     }
//     console.log("FINISH MAKE " + i + "th LT PRODUCT");
//
//   })
// } catch (e) {
//
//   // console.log("ERROR with SSG",i);
//   // return callback_sub();
//   console.log("===========================Some SSG error in" + i + "=====================================");
// }

//
//   product.save(function(err) {
//     if (err) {
//       console.log(i + "'s error is" + err);
//     }
//     console.log("FINISH MAKE " + i + "th LT PRODUCT");
//     // return callback_sub();
//   })
//
//   product_list_sl.find({
//     prd_REF: list.prd_REF
//   }, {
//     "_id": false,
//     "prd_Name": false,
//     "prd_Price": false,
//     "prd_1st": false,
//     "prd_2nd": false,
//     "prd_3rd": false,
//     "prd_Brand": false,
//     "prd_REF": false,
//     "prd_SLURL": true,
//     "prd_IMGURL": false
//   }, function(err_sl, product_sl) {
//     // console.log(product_sl);
//     if (product_sl) {
//
//
//
//
//       product_list_ssg.find({
//         prd_REF: list.prd_REF
//       }, {
//         "_id": false,
//         "prd_Name": false,
//         "prd_Price": false,
//         "prd_1st": false,
//         "prd_2nd": false,
//         "prd_3rd": false,
//         "prd_Brand": false,
//         "prd_REF": false,
//         "prd_SSGURL": true,
//         "prd_IMGURL": false
//       }, function(err_ssg, product_ssg) {
//         if (product_ssg) {
//           product.prd_id = i;
//           product.prd_Name = list.prd_Name,
//             product.prd_Price = list.prd_Price,
//             product.prd_1st = list.prd_1st,
//             product.prd_2nd = list.prd_2nd,
//             product.prd_3rd = list.prd_3rd
//           product.prd_Brand = list.prd_Brand,
//             product.prd_REF = list.prd_REF
//           product.prd_SLURL = product_sl[0].prd_SLURL,
//             product.prd_SSGURL = product_ssg[0].prd_SSGURL,
//             product.prd_ProductURL = list.prd_LTURL,
//             product.prd_IMGURL = list.prd_IMGURL;
//           product.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//           product.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//           return save_product(i, product);
//         } else {
//           product.prd_id = i;
//           product.prd_Name = list.prd_Name,
//             product.prd_Price = list.prd_Price,
//             product.prd_1st = list.prd_1st,
//             product.prd_2nd = list.prd_2nd,
//             product.prd_3rd = list.prd_3rd
//           product.prd_Brand = list.prd_Brand,
//             product.prd_REF = list.prd_REF
//           product.prd_SLURL = product_sl[0].prd_SLURL,
//             product.prd_SSGURL = '42',
//             product.prd_ProductURL = list.prd_LTURL,
//             product.prd_IMGURL = list.prd_IMGURL;
//           product.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//           product.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//           return save_product(i, product);
//         }
//
//
//       })
//
//     }
//     else{
//       product.prd_id = i;
//       product.prd_Name = list.prd_Name,
//         product.prd_Price = list.prd_Price,
//         product.prd_1st = list.prd_1st,
//         product.prd_2nd = list.prd_2nd,
//         product.prd_3rd = list.prd_3rd
//       product.prd_Brand = list.prd_Brand,
//         product.prd_REF = list.prd_REF
//       product.prd_SLURL = '42',
//         product.prd_SSGURL = '42',
//         product.prd_ProductURL = list.prd_LTURL,
//       product.prd_IMGURL = list.prd_IMGURL;
//       product.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//       product.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//       return save_product(i , product);
//     }
//
//   });
// } catch (e) {
//   console.log("===========================Some LT error in" + i + "=====================================");
//   // console.log(product_result[0]);
//   // console.log(e);

function save_sl() {


}
// product_list.find({
//   prd_3th: '바디 워시'
// }, function(err, product_list) {
//   console.log(product_list);
// })
// product_list.find({
// }).limit(6)
//     .exec(function (err, doc) {
//         console.log(doc);
//     });


// product_list.aggregate(
//    [ { $sample: { size: 8 } } ]
// ).exec(function(err, doc){
//   console.log(doc);
// })


// product_list.count({
//   prd_3th: '스킨/토너'
// }, function(err,count){
//   console.log(count);
// })
