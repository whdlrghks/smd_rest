var async = require('async'), mime = require('mime');
var PythonShell = require('python-shell');
var user_resevered = require('../models/user_resevered');
module.exports = function(app) {
  app.post('/api/checklottemembership', function(req, res){
    var options = req.body.options;
    var user_id = req.body.user_id;
    console.log("[GET API REQUEST ABOUT LOTTEMEMBERSHIP]");
    PythonShell.run('./src/python/authDutyfree/checkLotteID.py', options, function (err, results) {
      if (err) throw err;
       var result_list = results[0].split("/");
       if(result_list[0]=='lotte success'){
         var nowTime =  new Date().getTime();
         user_resevered.update({ user_id: user_id }, { $set: {updatedAt : nowTime , lotte_check : true,
           LT_reserved:result_list[1], LT_id:options.args[0], LT_pw:options.args[1]} }, function(err, output){
              if(err) console.log("error : "+err);
              
              res.json(result_list[0]);
          });
       }
       else{
         res.json(result_list[0]);
       }
    });
  })

  app.post('/api/checkshinlamembership', function(req, res){
    var options = req.body.options;
    var user_id = req.body.user_id;

    console.log("[GET API REQUEST ABOUT SHINLAMEMBERSHIP]");
    PythonShell.run('./src/python/authDutyfree/checkShinlaID.py', options, function (err, results) {
      if (err) throw err;

       var result_list = results[0].split("/");
       if(result_list[0]=='shinla success'){
         var nowTime =  new Date().getTime();
         user_resevered.update({ user_id: user_id }, { $set: {updatedAt : nowTime , shilla_check : true,
           SL_reserved:result_list[1], SL_id:options.args[0], SL_pw:options.args[1]}}, function(err, output){
              if(err) console.log("error : "+err);

              res.json(result_list[0]);
          });
       }
       else{
         res.json(result_list[0]);
       }
    });
  })

  app.post('/api/checkssgmembership', function(req, res){
    var options = req.body.options;
    var user_id = req.body.user_id;
    console.log("[GET API REQUEST ABOUT SSGMEMBERSHIP]");
    try{
      PythonShell.run('./src/python/authDutyfree/checkShinsaegaeID.py', options, function (err, results) {
        if (err) throw err;
        console.log(results);
        var result_list = results[0].split("/");
         if(result_list[0]=='ssg success'){
           var nowTime =  new Date().getTime();
           user_resevered.update({ user_id: user_id }, { $set: {updatedAt : nowTime , ssg_check : true,
             SSG_reserved:result_list[1], SSG_id:options.args[0], SSG_pw:options.args[1]} }, function(err, output){
                if(err) console.log("error : "+err);

                res.json(result_list[0]);
            });
         }
         else{
           res.json(result_list[0]);
         }
      });
    }
    catch(err){
      console.log("[SSG] IT HAS SOME ERROR ABOUT PYTHON GET SSG RESERVED",err);
    };

  })

  app.post('/api/getltreserved', function(req, res){

    var user_id = req.body.user_id;
    console.log("[GET LT RESERVED BY ",user_id,"]");
    user_resevered.find({
      user_id: user_id
    }, function(err, product_list) {
      console.log("[",user_id,"'s GET LT RESERVED]");

      res.json(product_list[0].LT_reserved);
    })
    // PythonShell.run('./src/python/reserveDutyfree/getLotte.py', options, function (err, results) {
    //   console.log("GET USER LOTTE MEMBERSHIP RESERVED POINT : " +results);
    //   if (err) throw err;
    //   res.json(results);
    // });
  })

  app.post('/api/getslreserved', function(req, res){
    var user_id = req.body.user_id;
    console.log("[GET LT RESERVED BY ",user_id,"]");
    user_resevered.find({
      user_id: user_id
    }, function(err, product_list) {
      console.log("[",user_id,"'s GET SL RESERVED]");

      res.json(product_list[0].SL_reserved);
    })
    // var options = req.body;
    // PythonShell.run('./src/python/reserveDutyfree/getShinla.py', options, function (err, results) {
    //   console.log("GET USER SHINLA MEMBERSHIP RESERVED POINT : " +results);
    //   if (err) throw err;
    //   res.json(results);
    // });
  })

  app.post('/api/getssgreserved', function(req, res){
    var user_id = req.body.user_id;
    console.log("[GET LT RESERVED BY ",user_id,"]");
    user_resevered.find({
      user_id: user_id
    }, function(err, product_list) {
      console.log("[",user_id,"'s GET SSG RESERVED]");

      res.json(product_list[0].SSG_reserved);
    })
    // var options = req.body;
    // PythonShell.run('./src/python/reserveDutyfree/getSSG.py', options, function (err, results) {
    //   console.log("GET USER SSG MEMBERSHIP RESERVED POINT : " +results);
    //   if (err) throw err;
    //   res.json(results);
    // });
  })
}
