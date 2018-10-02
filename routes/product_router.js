var async = require('async'), mime = require('mime');
var product_list = require('../models/product_list');
var PythonShell = require('python-shell');
var user_resevered = require('../models/user_resevered');
var review = require('../models/review_product');
var newcart = require('../models/user_cart');

module.exports = function(app, list) {

  app.post('/api/index', function(req,res){
    product_list.aggregate(
       [ { $sample: { size: 8 } } ]
    ).exec(function(err, doc){
      res.json(doc);
      // console.log(doc);
    })
  })

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
            result[3] = count;
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
            result[3] = count;
            res.json(result);
          })
        })
    }
  })

  app.post('/api/product', function(req, res) {
    console.log("API PRODUCT BY " + req.body.product_id);
    var _id = req.body.product_id;
    var user_id = req.body.user_id;
    console.log(user_id);
    var result = [];
    product_list.find({
        _id: _id
      })
      .exec(function(err, product) {
        if(user_id==undefined&&user_id==''){

          result[0] = product;

          res.json(result);
        }
        else{
          user_resevered.find({user_id : user_id})
          .exec(function(err, reserved){

            result[0]= product;
            result[1]= reserved;
            res.json(result);

          })
        }

      })
  })
  app.post('/api/product/SL', function(req, res) {
    console.log("API PRODUCT BY " + req.body.prd_url);
    var prd_url = req.body.prd_url;
    var result ;
    var percent_prd=0;
    if (prd_url != undefined) {
      console.log("SHINLA IN",prd_url);
      var options_sl = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [prd_url]
      }
      try{
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
            if(result[0].split("/")[1]=="로그인 필요"){
              var price = result[0].split("/")[0];
            }
            else{
              var price = result[0].split("/")[1];
            }
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
                  var discount_price = price * (1 - parseFloat(percent_prd/100))
                }

                else{
                  var discount_price = price - reserve
                }
            }
            console.log("[SL DICOUNT RESULT percent_prd = ",percent_prd,"discount_price = ",discount_price.toFixed(2),"]");
            result = result+"/"+percent_prd+"/"+discount_price.toFixed(2);
            res.json(result);
            // PythonShell.run('./src/python/productpython/cal_reserve.py', options_sl_cal, function(err, discount_price) {
            //   //result = 가격 / 재고
            //   console.log("SL_discount_price",discount_price);
            //   result = result+"/"+discount_price;
            //   res.json(result);
            // });

          }
        })
      }catch(e){
        console.log("[No product in SL]",prd_url);
        res.json("현재 세면대/시스템에 문제가/있습니다. 문의/부탁드립니다.")
      }

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
      console.log("LOTTE IN",prd_url);
      var options_lt = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [prd_url]
      };
      try{
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
                  percent_prd=results[0].split("/")[3];
                  console.log("LT result " + results);
                  result= results;
                  callback(null,"finish");
                }
              });
            }
          ],
          function(err, result_callback) {
            if (err) {
              res.json("Error From get the product");
            } else {
              if(result[0].split("/")[1]=="로그인 필요"){
                var price = result[0].split("/")[0];
              }
              else{
                var price = result[0].split("/")[1];
              }
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
                    var discount_price = price * (1 - parseFloat(percent_prd/100))
                  }

                  else{
                    var discount_price = price - reserve
                  }
              }
              console.log("[LT DICOUNT RESULT percent_prd = ",percent_prd,"discount_price = ",discount_price.toFixed(2),"]");
              result = result+"/"+discount_price.toFixed(2);
              res.json(result);
              // PythonShell.run('./src/python/productpython/cal_reserve.py', options_lt_cal, function(err, discount_price) {
              //   //result = 가격 / 재고
              //   console.log("LT_discount_price",discount_price);
              //   result = result+"/"+discount_price;
              //   res.json(result);
              // });

            }
          })
      }catch(e){
        console.log("[No product in LT]",prd_url);
        res.json("현재 세면대/시스템에 문제가/있습니다. 문의/부탁드립니다.")
      }


    } else {
      result = ['No price/No storage'];
      res.json(result);
    }

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
      try{
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
                percent_prd=results[0].split("/")[3];
                console.log("SSG result " + results);
                result= results;
                callback(null,"finish");
              }
            });
          }
          // ,function(callback){
          //   if(req.body.SSG_reserved!=''){
          //     PythonShell.run('./src/python/productpython/getssgpercent.py', options_ssg, function(err, percent) {
          //       //result = 가격 / 재고
          //       console.log("SSG percent",percent);
          //       if(percent!=null||percent!=undefined){
          //         percent_prd=percent[0];
          //       }
          //       callback(null,"finish");
          //     });
          //   }
          // }
        ],
        function(err, result_callback) {
          if (err) {
            res.json("Error From get the product");
          } else {
            if(result[0].split("/")[1]=="로그인 필요"){
              var price = result[0].split("/")[0];
            }
            else{
              var price = result[0].split("/")[1];
            }
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
                  var discount_price = price * (1 - parseFloat(percent_prd/100))
                }

                else{
                  var discount_price = price - reserve
                }
            }
            console.log("[SSG DICOUNT RESULT percent_prd = ",percent_prd,"discount_price = ",discount_price.toFixed(2),"]");
            result = result+"/"+discount_price.toFixed(2);
            res.json(result);
            // PythonShell.run('./src/python/productpython/cal_reserve.py', options_ssg_cal, function(err, discount_price) {
            //   //result = 가격 / 재고
            //   console.log("SSG_discount_price",discount_price);
            //   result = result+"/"+discount_price;
            //   res.json(result);
            // });

          }
        })
      }catch(e){
        console.log("[No product in SSG]",prd_url);
        res.json("현재 세면대/시스템에 문제가/있습니다. 문의/부탁드립니다.")
      }

    } else {
      result = ['No price/No storage'];
      res.json(result);
    }

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

  app.get('/api/autocomplete',function(req,res){
    console.log("API AUTOCOMPLETE LIST ");

    //나중에 한글 브랜드 추가되면 검색에 추가
    // product_list.find( { } , { "_id":false, "prd_Name": true, "prd_Brand": true } , function(err, list){
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
    //   	if( a.indexOf(b) < 0 ) a.push(b) ;
    //   	return a ;
    //   }, []) ; // <-- 초기값 빈 배열 세팅!
    //   res.json(single);
    // })
    res.json(list);
  })

  app.post('/api/product/search', function(req, res) {
    var startPage = req.body.startPage;
    var limit = req.body.limitPage;
    var prd_Name={$regex:req.body.searchbox, $options: 'i' };
    var prd_Brand={$regex:req.body.searchbox,  $options: 'i' };
    var prd_REF={$regex:req.body.searchbox,  $options: 'i' };
    //대소문자 구분 No =  '$options': 'i'
    if(req.body.category=="전체"){

      var findoption = {$or:[ {prd_Name: prd_Name }, {prd_Brand:prd_Brand}, {prd_REF:prd_REF} ]};
    }
    else if(req.body.category=="브랜드"){
      var findoption = {prd_Brand:prd_Brand};
    }
    else if(req.body.category=="상품 이름"){
      var findoption = {prd_Name:prd_Name};
    }
    else if(req.body.category=="상품 코드"){
      var findoption = {prd_REF:prd_REF};
    }
    else{
      console.log("NO RESULT ABOUT CATEGORIES");
      res.json("no result")
    }
    startPage = startPage * limit;
    console.log(findoption);
    //pagetoken 필요 - 한페이지 당 갯수 지정
    if (startPage == 0) {
      product_list.find(
        findoption
      )
        .limit(limit)
        .sort({ 'createdAt': -1 })
        .exec(function(err, product) {
          if(err){
            console.log(err);
          }
          product_list.count(findoption, function(err, count) {
            var result = [];
            result[0] = Math.ceil(count / limit);
            result[1] = product;
            result[2] = startPage;
            result[3] = count;
            res.json(result);
          })
        })
    } else {
      product_list.find(findoption)
        .limit(limit)
        .skip(startPage)
        .sort({ 'createdAt': -1 })
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

  app.post('/api/product/review/enroll', function(req, res) {
    // input : prd_id, user_id, content, username, rating(integer)
    // output :
    // review number
    // review list
    // review page
    // review content
    console.log("REVIEW ENROLL INFORMAION ");
    console.log(req.body);
    var prd_id = req.body.prd_id;
    var user_id = req.body.user_id;
    var content = req.body.content;
    var username = req.body.username;
    var rating = req.body.rating;
    var review_enroll= new review();
    review_enroll.prd_id = prd_id,
    review_enroll.user_id = user_id,
    review_enroll.user_username = username,
    review_enroll.rating = rating,
    review_enroll.content = content,
    review_enroll.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    review_enroll.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    review_enroll.save(function(err) {
      if (err) {
        console.log(i + "'s error is" + err);
      }
      console.log("[FINISH ENROLL USER'S REVIEW ABOUT ",prd_id,"]");
      res.json("success");
    })
  })


  app.post('/api/product/review/list', function(req, res) {
    // input : startpage, limit = 5 , prd_id
    // output :
    // review totalcount
    // review present point
    // review list
    // review content
    var prd_id = req.body.prd_id;
    var startPage = req.body.startPage;

    var limit = 3;
    startPage = startPage * limit;
    var findoption = { prd_id : prd_id};
    //pagetoken 필요 - 한페이지 당 갯수 지정
    if (startPage == 0) {
      review.find(
        findoption
      )
        .limit(limit)
        .sort({ 'createdAt': -1 })
        .exec(function(err, product) {
          review.count(findoption, function(err, count) {
            var result = {
              totalcount : count,
              present_point : startPage/limit,
              list : product
            };
            res.json(result);
          })
        })
    } else {
      review.find(findoption)
        .limit(limit)
        .skip(startPage)
        .sort({ 'createdAt': -1 })
        .exec(function(err, product) {
          review.count(findoption, function(err, count) {
            var result = {
              totalcount : count,
              present_point : startPage/limit,
              list : product
            };
            res.json(result);
          })
        })
    }

  })

  app.post('/api/product/addCart', function(req,res){
    let prd_id = req.body.prd_id;
    let user_id = req.body.user_id;
    let storage = req.body.storage;
    let img_url = req.body.img_url;
    let duty_category = req.body.duty_category;
    let price = req.body.price;
    let percent = req.body.percent;
    let prd_url = req.body.prd_url;
    let prd_name = req.body.prd_name;
    let user_cart= new newcart();
    console.log(req.body);
    user_cart.prd_id = prd_id,
    user_cart.user_id = user_id,
    user_cart.duty_category = duty_category,
    user_cart.storage = storage,
    user_cart.price = price,
    user_cart.img_url = img_url,
    user_cart.percent = percent,
    user_cart.prd_url = prd_url,
    user_cart.prd_name = prd_name,
    user_cart.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    user_cart.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    user_cart.save(function(err) {
      if (err) {
        console.log(i + "'s error is" + err);
      }
      console.log("[FINISH ADD USER'S CART ABOUT ",prd_id,"]");
      res.json("success");
    })
  })
  app.post('/api/product/getCartlist', function(req,res){
    let user_id = req.body.user_id;
    let findoption={
      user_id : user_id
    }
    newcart.find(
      findoption
    )
      .exec(function(err, product) {
        user_resevered.find(findoption).exec( function(err, user_info) {
          // console.log(user_info);
          var LT_reserved=user_info[0].LT_reserved;
          var SL_reserved=user_info[0].SL_reserved;
          var SSG_reserved=user_info[0].SSG_reserved;
          var result = {
            product_list : product,
            LT_reserved:LT_reserved,
            SL_reserved:SL_reserved,
            SSG_reserved:SSG_reserved
          };
          console.log(result);
          console.log("[FINISH GET USER'S CART LIST ABOUT ",user_id,"]");
          res.json(result);
        });


      })

  })

  app.post('/api/product/deleteCart', function(req,res){
    let _id = req.body._id;
    let findoption={
      _id : _id
    }
    newcart.remove(
      findoption
    )
      .exec(function(err, product) {
        res.json("success");
      })

  })
}
