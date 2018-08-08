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
    console.log(prd_1st);
    console.log(prd_2nd);
    console.log(prd_3rd);
    startPage = startPage * limit;
    //pagetoken 필요 - 한페이지 당 갯수 지정
    if (startPage == 0) {
      product_list.find({
          prd_1st: prd_1st,
          prd_2nd: prd_2nd,
          prd_3rd: prd_3rd
        })
        .limit(limit)
        .exec(function(err, product) {
          product_list.count({
            prd_1st: prd_1st,
            prd_2nd: prd_2nd,
            prd_3rd: prd_3rd
          }, function(err, count) {
            var result = [];
            result[0] = count / limit;
            result[1] = product;
            result[2] = startPage;
            res.json(result);
          })
        })
    } else {
      product_list.find({
          prd_1st: prd_1st,
          prd_2nd: prd_2nd,
          prd_3rd: prd_3rd
        })
        .limit(limit)
        .skip(startPage)
        .exec(function(err, product) {
          product_list.count({
            prd_1st: prd_1st,
            prd_2nd: prd_2nd,
            prd_3rd: prd_3rd
          }, function(err, count) {
            var result = [];
            result[0] = count / limit;
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
    var result;

    if (prd_url != undefined) {
      console.log("SHINLA IN");
      var options_sl = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [prd_url]
      }
      PythonShell.run('./src/python/productpython/slproduct.py', options_sl, function(err, results) {
        //result = 가격 / 재고
        console.log(results);
        if (err) throw err;
        if (results == "No price/No storage") {
          result = results;
          res.json(result);
        } else {
          console.log("SL result " + results);
          result = results;
          res.json(result);
        }
      });
    } else {
      result = ['No price/No storage'];
      res.json(result);
    }

  })
  app.post('/api/product/LT', function(req, res) {
    console.log("API PRODUCT BY " + req.body.prd_url);
    var prd_url = req.body.prd_url;
    var result;
    if (prd_url != undefined) {
      var options_lt = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [prd_url]
      }
      PythonShell.run('./src/python/productpython/ltproduct.py', options_lt, function(err, results) {
        //result = 가격 / 재고

        if (err) throw err;
        if (results == "No price/No storage") {
          result = results;
          res.json(result);
        } else {
          console.log("LT result " + results);
          result = results;
          res.json(result);
        }
      });
    } else {
      result = ['No price/No storage'];
      res.json(result);
    }

  })
  app.post('/api/product/SSG', function(req, res) {
    console.log("API PRODUCT BY " + req.body.prd_url);
    var prd_url = req.body.prd_url;
    var result;

    if (prd_url != '42') {
      var options_ssg = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [prd_url]
      }
      PythonShell.run('./src/python/productpython/ssgproduct.py', options_ssg, function(err, results) {

        //result = 가격 / 재고
        if (err) throw err;
        if (results == "No price/No storage") {
          result = results;
          res.json(result);
        } else {
          result = results;
          console.log("SSG result " + results);
          res.json(result);
        }
      });
    } else {
      result = ['No price/No storage'];
      res.json(result);
    }

  })
}
