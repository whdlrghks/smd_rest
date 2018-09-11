let XLSX = require("xlsx");
var product_list_test = require('../models/product_list_test');
let workbook = XLSX.readFile("/Users/ikhwan/Downloads/ssg_product_final.xlsx")
let worksheet_ssg = workbook.Sheets["ssg_product_final"]
let workbook2 = XLSX.readFile("/Users/ikhwan/Downloads/productInfo_Shilla(1-30000).xlsx")
let worksheet_sl = workbook2.Sheets["productInfo_Shilla(1~30000)"]
let workbook3 = XLSX.readFile("/Users/ikhwan/Downloads/prdInfo_Lotte_FINAL.xlsx")
let worksheet_lt = workbook3.Sheets["prdInfo_Lotte_FINAL"]
var async = require('async')

//SSG 데이터 가져오기  dd

var product_ssglist = new Array(74028);
var product_ltlist = new Array(74677);
var product_sllist = new Array(30000);

function ssg_callback(value, i, callback_sub) {

  // for (let i = 1; i <= 74028; i++) {
  var product_SSG = {
    prd_id: '',
    prd_Name: '',
    prd_Price: '',
    prd_1st: '',
    prd_2nd: '',
    prd_3rd: '',
    prd_Brand: '',
    prd_REF: '',
    prd_SSGURL: '',
    prd_IMGURL: ''
  };
  // console.log(i);
  // console.log(worksheet["D" + 4680]);
  try {
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
    product_ssglist[i] = product_SSG;
  } catch (e) {
    // console.log("===========================Some SSG error in" + i + "=====================================");
  }
  return callback_sub();
  // }
}

function sl_callback(value, i, callback_sub) {

  var product_SL = {
    prd_id: '',
    prd_Name: '',
    prd_Price: '',
    prd_1st: '',
    prd_2nd: '',
    prd_3rd: '',
    prd_Brand: '',
    prd_REF: '',
    prd_SLURL: '',
    prd_IMGURL: ''
  };
  try {
    product_SL.prd_id = i;
    product_SL.prd_Name = worksheet_sl["A" + i].v;
    product_SL.prd_Price = worksheet_sl["B" + i].v;
    product_SL.prd_1st = worksheet_sl["D" + i].v;
    product_SL.prd_2nd = worksheet_sl["E" + i].v;
    product_SL.prd_3rd = worksheet_sl["F" + i].v;
    product_SL.prd_Brand = worksheet_sl["G" + i].v;
    product_SL.prd_REF = worksheet_sl["I" + i].v;
    product_SL.prd_SLURL = worksheet_sl["K" + i].v;
    product_SL.prd_IMGURL = worksheet_sl["J" + i].v;
    product_sllist[i] = product_SL;
  } catch (e) {
    // console.log(e);
    // console.log("===========================Some SL error in" + i + "=====================================");
  }
  return callback_sub();
}

function lt_callback(value, i, callback_sub) {

  // console.log(i);
  // console.log(worksheet["D" + 4680]);
  var product_LT = {
    prd_id: '',
    prd_Name: '',
    prd_Price: '',
    prd_1st: '',
    prd_2nd: '',
    prd_3rd: '',
    prd_Brand: '',
    prd_REF: '',
    prd_LTURL: '',
    prd_IMGURL: ''
  };
  try {
    product_LT.prd_id = i;
    product_LT.prd_Name = worksheet_lt["A" + i].v;
    product_LT.prd_Price = worksheet_lt["B" + i].v;
    product_LT.prd_1st = worksheet_lt["C" + i].v;
    product_LT.prd_2nd = worksheet_lt["D" + i].v;
    product_LT.prd_3rd = worksheet_lt["E" + i].v;
    product_LT.prd_Brand = worksheet_lt["F" + i].v;
    product_LT.prd_REF = worksheet_lt["G" + i].v;
    product_LT.prd_LTURL = worksheet_lt["I" + i].v;
    product_LT.prd_IMGURL = worksheet_lt["H" + i].v;
    product_ltlist[i] = product_LT;
  } catch (e) {
    // console.log("===========================Some LT error in" + i + "=====================================");
  }
  return callback_sub();
}

function cate_algo(item_1, item_2, item_3, callback_algo) {
  //3개다 일치
  if (item_1 == undefined || item_2==undefined || item_3==undefined) {
    callback_algo("item_1 is undefined");
  } else if (item_1.prd_REF == item_2.prd_REF) {
    if (item_1.prd_REF == item_3.prd_REF) {
      var product = new product_list_test();
      var i = product_ltlist.indexOf(item_1);
      product.prd_id = i;
      product.prd_Name = item_1.prd_Name,
        product.prd_Price = item_1.prd_Price,
        product.prd_1st = item_1.prd_1st,
        product.prd_2nd = item_1.prd_2nd,
        product.prd_3rd = item_1.prd_3rd,
        product.prd_Brand = item_1.prd_Brand,
        product.prd_REF = item_1.prd_REF,
        product.prd_SLURL = item_2.prd_SLURL,
        product.prd_SSGURL = item_3.prd_SSGURL,
        product.prd_IMGURL = item_1.prd_IMGURL,
        product.prd_ProductURL = item_1.prd_LTURL;
      product.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      product.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      product.save(function(err) {
        if (err) {
          console.log(i + "'s error is" + err);
        }
        console.log("FINISH MAKE " + i + "th PRODUCT");

      })
      callback_algo(null);
    } else {
      callback_algo(null);
    }
  } else if (item_1.prd_REF == item_3.prd_REF) {
    var product = new product_list_test();
    var i = product_ltlist.indexOf(item_1);
    product.prd_id = i;
    product.prd_Name = item_1.prd_Name,
      product.prd_Price = item_1.prd_Price,
      product.prd_1st = item_1.prd_1st,
      product.prd_2nd = item_1.prd_2nd,
      product.prd_3rd = item_1.prd_3rd,
      product.prd_Brand = item_1.prd_Brand,
      product.prd_REF = item_1.prd_REF,
      product.prd_SLURL = '42',
      product.prd_SSGURL = item_3.prd_SSGURL,
      product.prd_IMGURL = item_1.prd_IMGURL,
      product.prd_ProductURL = item_1.prd_LTURL;
    product.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product.save(function(err) {
      if (err) {
        console.log(i + "'s error is" + err);
      }
      console.log("FINISH MAKE " + i + "th PRODUCT");
    });
    callback_algo(null);
  } else if (item_1.prd_Price == item_2.prd_Price && item_1.prd_Brand == item_2.prd_Brand) {
    if (item_1.prd_Price == item_3.prd_Price && item_1.prd_Brand == item_3.prd_Brand) {
      var product = new product_list_test();
      var i = product_ltlist.indexOf(item_1);
      product.prd_id = i;
      product.prd_Name = item_1.prd_Name,
        product.prd_Price = item_1.prd_Price,
        product.prd_1st = item_1.prd_1st,
        product.prd_2nd = item_1.prd_2nd,
        product.prd_3rd = item_1.prd_3rd,
        product.prd_Brand = item_1.prd_Brand,
        product.prd_REF = item_1.prd_REF,
        product.prd_SLURL = item_2.prd_SLURL,
        product.prd_SSGURL = item_3.prd_SSGURL,
        product.prd_IMGURL = item_1.prd_IMGURL,
        product.prd_ProductURL = item_1.prd_LTURL;
      product.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      product.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      product.save(function(err) {
        if (err) {
          console.log(i + "'s error is" + err);
        }
        console.log("FINISH MAKE " + i + "th PRODUCT");
      });
      callback_algo(null);
    } else {
      callback_algo(null);
    }
  } else if (item_1.prd_Price == item_3.prd_Price && item_1.prd_Brand == item_3.prd_Brand) {
    var product = new product_list_test();
    var i = product_ltlist.indexOf(item_1);
    product.prd_id = i;
    product.prd_Name = item_1.prd_Name,
      product.prd_Price = item_1.prd_Price,
      product.prd_1st = item_1.prd_1st,
      product.prd_2nd = item_1.prd_2nd,
      product.prd_3rd = item_1.prd_3rd,
      product.prd_Brand = item_1.prd_Brand,
      product.prd_REF = item_1.prd_REF,
      product.prd_SLURL = '42',
      product.prd_SSGURL = item_3.prd_SSGURL,
      product.prd_IMGURL = item_1.prd_IMGURL,
      product.prd_ProductURL = item_1.prd_LTURL;
    product.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    product.save(function(err) {
      if (err) {
        console.log(i + "'s error is" + err);
      }
      console.log("FINISH MAKE " + i + "th PRODUCT");
    })
    callback_algo(null);
  } else {
    //list를 따로 저장을 시켜줘야 할 듯
    callback_algo("Not find collect data");
  }
  // else if (item_2.prd_REF == item_3.prd_REF){
  //   //카테고리 일치화 알고리즘이 구축되면 추가 시킬 예정.
  //
  // }
  // else if (item_2.prd_Price == item_3.prd_Price && item_2.prd_Brand == item_3.prd_Brand){
  //   //카테고리 일치화 알고리즘이 구축되면 추가 시킬 예정.
  //
  // }
  //
  // else{
  //   //롯데만 있는 경우 롯데만 있는경우에서 넣는다.
  //   product.prd_id = i;
  //   product.prd_Name= item_1.prd_Name,
  //   product.prd_Price= item_1.prd_Price,
  //   product.prd_1st= item_1.prd_1st,
  //   product.prd_2nd= item_1.prd_2nd,
  //   product.prd_3rd= item_1.prd_3rd,
  //   product.prd_Brand= item_1.prd_Brand,
  //   product.prd_REF= item_1.prd_REF,
  //   product.prd_SLURL= '42',
  //   product.prd_SSGURL= '42',
  //   product.prd_IMGURL= item_1.prd_IMGURL,
  //   product.prd_ProductURL= item_1.prd_LTURL;
  //   product.createdAt= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  //   product.updatedAt= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  //
  // }
}

function cal_with_lt(value, callback_sub2){
  async.forEachOf(product_ssglist, function(product_ssg, i, callback_2) {
    if (product_ssg == undefined) {
      callback_2(null, "no result");
    } else {
      async.forEachOf(product_sllist, function(product_sl, j, callback_3) {
        if (product_sl == undefined) {
          callback_3(null, "no result");
        } else {
          if (j == 30000) {
            callback_3(null, "finish result"+j);
          } else {
            cate_algo(value, product_ssg, product_sl, function(err) {
              if (err) {
                // console.log(k, "is undefiend");
                callback_3(null, "finish result"+j)
              } else {

                callback_3(null, "finish result"+j);
              }
            })
          }
        }
      }, function(err, results_3) {
        console.log("Check with  lotte item   ", i, "'s ssg item   ", results_3, "'s sl item");
        callback_2(null, "finish")
      })
    }
  }, function(err, results_2) {
    callback_sub2(null, "finish");
  })
}


function f(index,callback){
  console.log("Start ",index,"function ");
    for( var  i = index*1000 ; i < index*9000 ; i ++) {
      if(i%100==0){
        console.log("FINISH at ",i);
      }
      cal_with_lt(product_ltlist[i],i,function(err, results){
        if(i==14999){
          console.log("i is",14999);
          callback(null,"finish");
        }
        console.log(results);
      })
    }
}


function loop_for_algo(timestamp2) {

  async.each(product_ltlist, function(item,callback_each){
      cal_with_lt(item,function(err, results){
        console.log(results);
        callback_each(null);
      })
  },
  function(err){
    console.log('Finish upload Product data in ', new Date().getTime() - timestamp2, 'ms');
    console.log("[FINISH ALL DATA TO MONGODB]");

  })
  // // 할당할 tasks 세팅
  // var firstarray=product_ltlist.slice(0,15000);
  // var secondarray=product_ltlist.slice(15000,30000);
  // var thirdarray=product_ltlist.slice(30000,45000);
  // var fourtharray=product_ltlist.slice(45000,60000);
  // var fiftharray=product_ltlist.slice(60000,74677);
  //
  // //현재 루프 도는 속도가 너무 느리다. 병렬로 바꿔서 parrell로 돌리는게 나을거 같다.
  // async.parallel(
  //   [
  //   function(callback) {
  //     console.log("First function");
  //     async.each(firstarray,function(item,callback_each){
  //       cal_with_lt(item,function(err, results){
  //         console.log(results);
  //         callback_each(null);
  //       })
  //     },function(err){
  //       callback(null,"finish");
  //     })
  //   },
  //   function(callback) {
  //     console.log("Second function");
  //     async.each(secondarray,function(item,callback_each){
  //       cal_with_lt(item,function(err, results){
  //         console.log(results);
  //         callback_each(null);
  //       })
  //     },function(err){
  //       callback(null,"finish");
  //     })
  //   },
  //   function(callback) {
  //     console.log("Third function");
  //     async.each(thirdarray,function(item,callback_each){
  //       cal_with_lt(item,function(err, results){
  //         console.log(results);
  //         callback_each(null);
  //       })
  //     },function(err){
  //       callback(null,"finish");
  //     })
  //   },
  //   function(callback) {
  //     console.log("Fourth function");
  //     async.each(fourtharray,function(item,callback_each){
  //       cal_with_lt(item,function(err, results){
  //         console.log(results);
  //         callback_each(null);
  //       })
  //     },function(err){
  //       callback(null,"finish");
  //     })
  //   },
  //   function(callback) {
  //     console.log("Fifth function");
  //     async.each(fiftharray,function(item,callback_each){
  //       cal_with_lt(item,function(err, results){
  //         console.log(results);
  //         callback_each(null);
  //       })
  //     },function(err){
  //       callback(null,"finish");
  //     })
  //   }
  // ]
  // , function(err, results) {
  //   if(err){
  //     console.log(err);
  //   }
  //   console.log("[FINISH ALL DATA TO MONGODB]");
  //
  // });


  //
  //
  // async.forEachOf(product_ltlist, function(value, k, callback_sub2) {
  //
  //
  //     if (value == undefined) {
  //       callback_sub2(null, "no result");
  //     } else {
  //
  //
  //
  //       async.forEachOf(product_ssglist, function(product_ssg, i, callback_2) {
  //         if (product_ssg == undefined) {
  //           callback_2(null, "no result");
  //         } else {
  //           async.forEachOf(product_sllist, function(product_sl, j, callback_3) {
  //             if (product_sl == undefined) {
  //               callback_3(null, "no result");
  //             } else {
  //               if (j == 30000) {
  //                 callback_3(null, "finish result"+j);
  //               } else {
  //                 cate_algo(value, product_ssg, product_sl, function(err) {
  //                   if (err) {
  //                     // console.log(k, "is undefiend");
  //                     callback_3(null, "finish result"+j)
  //                   } else {
  //                     callback_3(null, "finish result"+j);
  //                   }
  //                 })
  //               }
  //             }
  //           }, function(err, results_3) {
  //             console.log("Check with ", k, "'s lotte item   ", i, "'s ssg item   ", results_3, "'s sl item");
  //             callback_2(null, "finish")
  //           })
  //         }
  //       }, function(err, results_2) {
  //         callback_sub2(null, "finish");
  //       })
  //
  //
  //
  //     }
  //   },
  //     function(err, results) {
  //       console.log('Finish merging algo in ', new Date().getTime() - timestamp2, 'ms');
  //     })
  }

  function getProduct() {
    var timestamp = new Date().getTime();
    async.parallel([
      function(callback) {
        async.forEachOf(product_ssglist, ssg_callback, function(err) {
          // if (err) console.log(err.message);
          // else {
          console.log("FINISH SSG PRODUCT");

          callback(null, "finish ssg");

          // }
        })
      },
      function(callback) {
        async.forEachOf(product_sllist, sl_callback, function(err) {
          // if (err) console.log(err.message);
          // else {
          console.log("FINISH SL PRODUCT");

          callback(null, "finish sl");
          // }
        })

      },
      function(callback) {
        async.forEachOf(product_sllist, lt_callback, function(err) {
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
      loop_for_algo(timestamp2);
      // async.eachSeries(product_ltlist,function(lt_item, callback_1){
      //   if(lt_item==undefined){
      //     // callback_1(null,"no result");
      //   }
      //   else{
      //     for(var i = 0 ; i < 74028 ; i++){
      //       if(product_ssglist[i]==undefined){
      //         continue;
      //       }
      //       else{
      //         for(var j = 0 ; j < 30000 ; j++){
      //           if(product_sllist[j]==undefined){
      //             continue;
      //           }
      //           else{
      //             cate_algo(lt_item,product_ssglist[i],product_sllist[j],function(){
      //               callback_1(null,"finish result");
      //             })
      //           }
      //
      //         }
      //       }
      //
      //     }
      //   }
      //
      // },function(err, results){
      //     console.log('Finish merging algo in ', new Date().getTime() - timestamp2, 'ms');
      // });

              // for (var i = 0; i < 74028; i++) {
              //   if (product_ssglist[i] != undefined) {
              //     for (var j = 0; j < 30000; j++) {
              //       if (product_sllist[j] != undefined) {
              //         cate_algo(value, product_ssglist[i], product_sllist[j], function(err) {
              //           if(err){
              //             console.log(k,"is undefiend");
              //
              //           }
              //           else{
              //
              //               callback_sub2(null, "finish result");
              //               break;
              //           }
              //
              //
              //
              //         })
              //       } else {
              //         continue;
              //       }
              //     }
              //   } else {
              //     continue;
              //   }
              // }


              // }
    });
  }

  getProduct();
