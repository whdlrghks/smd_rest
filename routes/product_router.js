var async = require('async'), mime = require('mime');
var product_list = require('../models/product_list');
var PythonShell = require('python-shell');

module.exports = function(app) {

  //처음 카테고리 들어갈때에 최종적으로 몇개인지 알아낸다. 그래서 그만큼의 페이지를 만든다.
  app.post('/api/category', function(req, res) {
    var prd_1st = req.body.depth1;
    var prd_2nd = req.body.depth2;
    var prd_3rd = req.body.depth3;
    var startPage = req.body.startPage;
    var limit = req.body.limitPage;
    if(req.body.depth3!=''){
      var findoption = {
          prd_1st: prd_1st,
          prd_2nd: prd_2nd,
          prd_3rd: prd_3rd
        };
    }
    else if(req.body.depth2!=''){
      var findoption = {
          prd_1st: prd_1st,
          prd_2nd: prd_2nd
        }
    }
    else if(req.body.depth1!=''){
      var findoption  = {
          prd_1st: prd_1st
        }
    }
    else{
      console.log("NO RESULT ABOUT CATEGORIES");
      res.json("no result")
    }
    startPage = startPage * limit;
    //pagetoken 필요 - 한페이지 당 갯수 지정
    if (startPage == 0) {
      product_list.find(
        findoption
      )
        .limit(limit)
        .exec(function(err, product) {
          product_list.count(findoption, function(err, count) {
            var result = [];
            result[0] = Math.ceil(count / limit);
            result[1] = product;
            result[2] = startPage;
            res.json(result);
          })
        })
    } else {
      product_list.find(findoption)
        .limit(limit)
        .skip(startPage)
        .exec(function(err, product) {
          product_list.count(findoption, function(err, count) {
            var result = [];
            result[0] = Math.ceil(count / limit);
            result[1] = product;
            result[2] = startPage;
            res.json(result);
          })
        })
    }
  })

  app.post('/api/product', function(req, res) {
    console.log("API PRODUCT BY " + req.body.product_id);
    var _id = req.body.product_id;
    var result = [];
    product_list.find({
        _id: _id
      })
      .exec(function(err, product) {
        result[0] = product;
        console.log(product);
        res.json(result);
        //신라 URL이 있는 경우
        // async.parallel([
        //     function(callback) {
        //       if (product[0].prd_SLURL != undefined) {
        //         console.log("SHINLA IN");
        //         var options_sl = {
        //           mode: 'text',
        //           pythonPath: '',
        //           pythonOptions: ['-u'],
        //           scriptPath: '',
        //           args: [product[0].prd_SLURL]
        //         }
        //         PythonShell.run('./src/python/productpython/slproduct.py', options_sl, function(err, results) {
        //           //result = 가격 / 재고
        //           console.log(results);
        //           if (err) throw err;
        //           if (results == "No price/No storage") {
        //             result[1] = results;
        //             callback(null, "No result");
        //           } else {
        //             console.log("SL result " + results);
        //             result[1] = results;
        //             callback(null, "Get info");
        //           }
        //         });
        //       } else {
        //         result[1] = ['No price/No storage'];
        //         callback(null, null);
        //       }
        //     },
        //     function(callback) {
        //       if (product[0].prd_ProductURL != undefined) {
        //         var options_lt = {
        //           mode: 'text',
        //           pythonPath: '',
        //           pythonOptions: ['-u'],
        //           scriptPath: '',
        //           args: [product[0].prd_ProductURL]
        //         }
        //         PythonShell.run('./src/python/productpython/ltproduct.py', options_lt, function(err, results) {
        //           //result = 가격 / 재고
        //
        //           if (err) throw err;
        //           if (results == "No price/No storage") {
        //             result[2] = results;
        //             callback(null, "No result");
        //           } else {
        //             console.log("LT result " + results);
        //             result[2] = results;
        //             callback(null, "Get info");
        //           }
        //         });
        //       } else {
        //         result[2] = ['No price/No storage'];
        //         callback(null, null);
        //       }
        //     },
        //     function(callback) {
        //
        //       if (product[0].prd_SSGURL != '42') {
        //         var options_ssg = {
        //           mode: 'text',
        //           pythonPath: '',
        //           pythonOptions: ['-u'],
        //           scriptPath: '',
        //           args: [product[0].prd_SSGURL]
        //         }
        //         PythonShell.run('./src/python/productpython/ssgproduct.py', options_ssg, function(err, results) {
        //
        //           //result = 가격 / 재고
        //           if (err) throw err;
        //           if (results == "No price/No storage") {
        //             result[3] = results;
        //             callback(null, "No result");
        //           } else {
        //             result[3] = results;
        //             console.log("SSG result " + results);
        //             callback(null, "Get info");
        //           }
        //         });
        //       } else {
        //         result[3] = ['No price/No storage'];
        //         callback(null, null);
        //       }
        //     }
        //   ],
        //   function(err, result_callback) {
        //     if (err) {
        //       console.log("ERROR FROM GET THE PRODUCT ABOUT", product[0]._id);
        //       res.json("Error From get the product");
        //     } else {
        //       console.log("FINISH GET THE PRODUCT ABOUT", product[0]._id);
        //
        //       res.json(result);
        //     }
        //   })
        // result[1] = "신라 정보";
        // result[2] = "롯데 정보";
        // result[3] = "신세계 정보";



      })
  })
  app.post('/api/product/SL', function(req, res) {
    console.log("API PRODUCT BY " + req.body.prd_url);
    var prd_url = req.body.prd_url;
    var result ;
    var percent_prd=0;
    if (prd_url != undefined) {
      console.log("SHINLA IN");
      var options_sl = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [prd_url]
      }
      async.parallel([
          function(callback){
            PythonShell.run('./src/python/productpython/slproduct.py', options_sl, function(err, results) {
              //result = 가격 / 재고
              console.log(results);
              if (err) throw err;
              if (results == "No price/No storage") {
                result= results;
                callback(null,"finish");
              } else {
                console.log("SL result " + results);
                result= results;
                callback(null,"finish");
              }
            });
          },
          function(callback){
            if(req.body.SL_reserved!=''){
              PythonShell.run('./src/python/productpython/getslpercent.py', options_sl, function(err, percent) {
                //result = 가격 / 재고
                console.log("SL percent",percent);
                if(percent!=null||percent!=undefined){
                  percent_prd=percent[0];
                }
                callback(null,"finish");
              });
            }
          }
        ],
        function(err, result_callback) {
          if (err) {
            res.json("Error From get the product");
          } else {
            var price = result[0].split("/")[0];
            var options_sl_cal = {
              mode: 'text',
              pythonPath: '',
              pythonOptions: ['-u'],
              scriptPath: '',
              args: [percent_prd,price,req.body.SL_reserved]
            }
            percent_prd=percent_prd*1;
            price= price*1;
            var reserve = req.body.SL_reserved*1;
            if(percent_prd == 0)
                var discount_price = price;
            else{
                if (reserve >= (price * (percent_prd/100))){
                  var discount_price = price * (1 - float(percent_prd/100))
                }

                else{
                  var discount_price = price - reserve
                }
            }
            result = result+"/"+discount_price;
            res.json(result);
            // PythonShell.run('./src/python/productpython/cal_reserve.py', options_sl_cal, function(err, discount_price) {
            //   //result = 가격 / 재고
            //   console.log("SL_discount_price",discount_price);
            //   result = result+"/"+discount_price;
            //   res.json(result);
            // });

          }
        })

    } else {
      result = ['No price/No storage'];
      res.json(result);
    }

  })
  app.post('/api/product/LT', function(req, res) {
    console.log("API PRODUCT BY " + req.body.prd_url);

    var prd_url = req.body.prd_url;
    var result ;
    var percent_prd=0;
    if (prd_url != undefined) {
      console.log("LOTTE IN");
      var options_lt = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [prd_url]
      }
      async.parallel([
          function(callback){
            PythonShell.run('./src/python/productpython/ltproduct.py', options_lt, function(err, results) {
              //result = 가격 / 재고
              console.log(results);
              if (err) throw err;
              if (results == "No price/No storage") {
                result= results;
                callback(null,"finish");
              } else {
                console.log("SL result " + results);
                result= results;
                callback(null,"finish");
              }
            });
          },
          function(callback){
            if(req.body.LT_reserved!=''){
              PythonShell.run('./src/python/productpython/getltpercent.py', options_lt, function(err, percent) {
                //result = 가격 / 재고
                console.log("LT percent",percent);
                if(percent!=null||percent!=undefined){
                  percent_prd=percent[0];
                }
                callback(null,"finish");
              });
            }
          }
        ],
        function(err, result_callback) {
          if (err) {
            res.json("Error From get the product");
          } else {
            var price = result[0].split("/")[0];
            var options_lt_cal = {
              mode: 'text',
              pythonPath: '',
              pythonOptions: ['-u'],
              scriptPath: '',
              args: [percent_prd,price,req.body.LT_reserved]
            }
            percent_prd=percent_prd*1;
            price= price*1;
            var reserve = req.body.LT_reserved*1;
            if(percent_prd == 0)
                var discount_price = price;
            else{
                if (reserve >= (price * (percent_prd/100))){
                  var discount_price = price * (1 - float(percent_prd/100))
                }

                else{
                  var discount_price = price - reserve
                }
            }
            result = result+"/"+discount_price;
            res.json(result);
            // PythonShell.run('./src/python/productpython/cal_reserve.py', options_lt_cal, function(err, discount_price) {
            //   //result = 가격 / 재고
            //   console.log("LT_discount_price",discount_price);
            //   result = result+"/"+discount_price;
            //   res.json(result);
            // });

          }
        })

    } else {
      result = ['No price/No storage'];
      res.json(result);
    }
    //
    // var prd_url = req.body.prd_url;
    // var result;
    // if (prd_url != undefined) {
    //   var options_lt = {
    //     mode: 'text',
    //     pythonPath: '',
    //     pythonOptions: ['-u'],
    //     scriptPath: '',
    //     args: [prd_url]
    //   }
    //   PythonShell.run('./src/python/productpython/ltproduct.py', options_lt, function(err, results) {
    //     //result = 가격 / 재고
    //
    //     if (err) throw err;
    //     if (results == "No price/No storage") {
    //       result = results;
    //       res.json(result);
    //     } else {
    //       console.log("LT result " + results);
    //       result = results;
    //       res.json(result);
    //     }
    //   });
    // } else {
    //   result = ['No price/No storage'];
    //   res.json(result);
    // }

  })
  app.post('/api/product/SSG', function(req, res) {
    console.log("API PRODUCT BY " + req.body.prd_url);
    var prd_url = req.body.prd_url;
    var result ;
    var percent_prd=0;
    if (prd_url != undefined) {
      console.log("SSG IN");
      var options_ssg = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [prd_url]
      }
      async.parallel([
          function(callback){
            PythonShell.run('./src/python/productpython/ssgproduct.py', options_ssg, function(err, results) {
              //result = 가격 / 재고
              console.log(results);
              if (err) throw err;
              if (results == "No price/No storage") {
                result= results;
                callback(null,"finish");
              } else {
                console.log("SSG result " + results);
                result= results;
                callback(null,"finish");
              }
            });
          },
          function(callback){
            if(req.body.SSG_reserved!=''){
              PythonShell.run('./src/python/productpython/getssgpercent.py', options_ssg, function(err, percent) {
                //result = 가격 / 재고
                console.log("SSG percent",percent);
                if(percent!=null||percent!=undefined){
                  percent_prd=percent[0];
                }
                callback(null,"finish");
              });
            }
          }
        ],
        function(err, result_callback) {
          if (err) {
            res.json("Error From get the product");
          } else {
            var price = result[0].split("/")[0];
            var options_ssg_cal = {
              mode: 'text',
              pythonPath: '',
              pythonOptions: ['-u'],
              scriptPath: '',
              args: [percent_prd,price,req.body.SSG_reserved]
            }
            percent_prd=percent_prd*1;
            price= price*1;
            var reserve = req.body.SSG_reserved*1;
            if(percent_prd == 0)
                var discount_price = price;
            else{
                if (reserve >= (price * (percent_prd/100))){
                  var discount_price = price * (1 - float(percent_prd/100))
                }

                else{
                  var discount_price = price - reserve
                }
            }
            result = result+"/"+discount_price;
            res.json(result);
            // PythonShell.run('./src/python/productpython/cal_reserve.py', options_ssg_cal, function(err, discount_price) {
            //   //result = 가격 / 재고
            //   console.log("SSG_discount_price",discount_price);
            //   result = result+"/"+discount_price;
            //   res.json(result);
            // });

          }
        })

    } else {
      result = ['No price/No storage'];
      res.json(result);
    }

    // var result;
    //
    // if (prd_url != '42') {
    //   var options_ssg = {
    //     mode: 'text',
    //     pythonPath: '',
    //     pythonOptions: ['-u'],
    //     scriptPath: '',
    //     args: [prd_url]
    //   }
    //   PythonShell.run('./src/python/productpython/ssgproduct.py', options_ssg, function(err, results) {
    //
    //     //result = 가격 / 재고
    //     if (err) throw err;
    //     if (results == "No price/No storage") {
    //       result = results;
    //       res.json(result);
    //     } else {
    //       result = results;
    //       console.log("SSG result " + results);
    //       res.json(result);
    //     }
    //   });
    // } else {
    //   result = ['No price/No storage'];
    //   res.json(result);
    // }

  })

  app.post('/api/product/post', function(req,res){
    console.log("API PRODUCT POST BY " + req.body.prd_name);
    var prd_name = req.body.prd_name;
    var post_result;
    var options_post = {
      mode: 'text',
      pythonPath: '',
      pythonOptions: ['-u'],
      scriptPath: '',
      args: [prd_name]
    };
    PythonShell.run('./src/python/productpython/getPost.py',options_post, function(err, results){
      if(err)throw err;
      console.log(results);
      res.json(results);
    })
  })
}
