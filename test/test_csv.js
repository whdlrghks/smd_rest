//몽고디비에 3개의 프로덕트 다 저장
// 몽고디비 find를 통해서 찾는다.
var mongoose = require('mongoose');
var mongodb = require('../config/mongodb.js');
mongodb();
let XLSX = require("xlsx");
var product_list_test = require('../models/product_list_test');
var product_list_lt = require('../models/product_list_lt');
var product_list_sl = require('../models/product_list_sl');
var product_list_ssg = require('../models/product_list_ssg');
let workbook = XLSX.readFile("/Users/ikhwan/Downloads/ssg_product_final.xlsx");
let worksheet_ssg = workbook.Sheets["ssg_product_final"];
let workbook2 = XLSX.readFile("/Users/ikhwan/Downloads/productInfo_Shilla(1-30000).xlsx");
let worksheet_sl = workbook2.Sheets["productInfo_Shilla(1~30000)"];
let workbook3 = XLSX.readFile("/Users/ikhwan/Downloads/prdInfo_Lotte_FINAL.xlsx");
let worksheet_lt = workbook3.Sheets["prdInfo_Lotte_FINAL"];
var async = require('async');
var product_ssglist = new Array(74028);
var product_ltlist = new Array(74677);
var product_sllist = new Array(30000);

function ssg_callback(value, i, callback_sub) {
  try {
    var product_SSG = new product_list_ssg();
    product_SSG.prd_id = i;
    product_SSG.prd_Name = worksheet_ssg["A" + i].v;
    product_SSG.prd_Price = worksheet_ssg["B" + i].v;
    product_SSG.prd_1st = worksheet_ssg["D" + i].v;
    product_SSG.prd_2nd = worksheet_ssg["E" + i].v;
    product_SSG.prd_3rd = worksheet_ssg["F" + i].v;
    product_SSG.prd_Brand = worksheet_ssg["H" + i].v;
    product_SSG.prd_REF = worksheet_ssg["I" + i].v;
    product_SSG.prd_SSGURL = worksheet_ssg["K" + i].v;
    product_SSG.prd_IMGURL = worksheet_ssg["J" + i].v;
    product_SSG.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product_SSG.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product_SSG.save(function(err) {
      if (err) {
        console.log(i + "'s error is" + err);
      }
      console.log("FINISH MAKE " + i + "th SSG PRODUCT");
      return callback_sub();
    })
  } catch (e) {

    // console.log("ERROR with SSG",i);
    return callback_sub();
    // console.log("===========================Some SSG error in" + i + "=====================================");
  }
}

function sl_callback(value, i, callback_sub) {
  try {
    var product_SL = new product_list_sl();
    product_SL.prd_id = i;
    product_SL.prd_Name = worksheet_sl["A" + i].v;
    product_SL.prd_Price = worksheet_sl["B" + i].v;
    product_SL.prd_1st = worksheet_sl["D" + i].v;
    product_SL.prd_2nd = worksheet_sl["E" + i].v;
    product_SL.prd_3rd = worksheet_sl["F" + i].v;
    product_SL.prd_Brand = worksheet_sl["H" + i].v;
    product_SL.prd_REF = worksheet_sl["I" + i].v;
    product_SL.prd_SLURL = worksheet_sl["K" + i].v;
    product_SL.prd_IMGURL = worksheet_sl["J" + i].v;
    product_SL.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product_SL.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product_SL.save(function(err) {
      if (err) {
        console.log(i + "'s error is" + err);
      }
      console.log("FINISH MAKE " + i + "th SL PRODUCT");
      return callback_sub();
    })
  } catch (e) {
    // console.log("ERROR with SL",i);

    return callback_sub();
    // console.log("===========================Some SSG error in" + i + "=====================================");
  }
}

function lt_callback(value, i, callback_sub) {
  try {
    var product_LT = new product_list_lt();
    product_LT.prd_id = i;
    product_LT.prd_Name = worksheet_lt["A" + i].v;
    product_LT.prd_Price = worksheet_lt["B" + i].v;
    product_LT.prd_1st = worksheet_lt["D" + i].v;
    product_LT.prd_2nd = worksheet_lt["E" + i].v;
    product_LT.prd_3rd = worksheet_lt["F" + i].v;
    product_LT.prd_Brand = worksheet_lt["H" + i].v;
    product_LT.prd_REF = worksheet_lt["G" + i].v;
    product_LT.prd_LTURL = worksheet_lt["I" + i].v;
    product_LT.prd_IMGURL = worksheet_lt["H" + i].v;
    product_LT.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product_LT.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product_LT.save(function(err) {
      if (err) {
        console.log(i + "'s error is" + err);
      }
      console.log("FINISH MAKE " + i + "th LT PRODUCT");
      return callback_sub();
    })
  } catch (e) {
    // console.log("ERROR with LT",i);
    return callback_sub();
    // console.log("===========================Some SSG error in" + i + "=====================================");
  }
}
function getProduct() {
  console.log("START");
  var timestamp = new Date().getTime();
  async.parallel([
    function(callback) {
      console.log("START SSG PRODUCT");
      async.forEachOf(product_ssglist, ssg_callback, function(err) {
        // if (err) console.log(err.message);
        // else {
        console.log("FINISH SSG PRODUCT");

        callback(null, "finish ssg");
        // }
      })
    },
    function(callback) {
      console.log("START SL PRODUCT");
      async.forEachOf(product_sllist, sl_callback, function(err) {
        // if (err) console.log(err.message);
        // else {
        console.log("FINISH SL PRODUCT");

        callback(null, "finish sl");
        // }
      })
    },
    function(callback) {
      console.log("START LT PRODUCT");
      async.forEachOf(product_ltlist, lt_callback, function(err) {
        // if (err) console.log(err.message);
        // else {
        console.log("FINISH LT PRODUCT");

        callback(null, "finish lt");
        // }
      })
    }
  ], function(err, results) {
    console.log('Finish get Product data in ', new Date().getTime() - timestamp, 'ms');
    var timestamp2 = new Date().getTime();
  });
}

getProduct();
