var async = require('async'), mime = require('mime');
var user_resevered = require('../models/user_resevered');
var PythonShell = require('python-shell');
module.exports = function(app) {
  app.post('/api/register_user', function(req, res){
    console.log("ININININREGISTER");
    var user_id = req.body.user_id;
    var user_info = new user_resevered();
    user_info.user_id = user_id,
    user_info.lotte_check = false,
    user_info.shilla_check = false,
    user_info.ssg_check = false,
    user_info.LT_reserved = null,
    user_info.SL_reserved = null,
    user_info.SSG_reserved = null,
    user_info.LT_id= null,
    user_info.LT_pw= null,
    user_info.SL_id= null,
    user_info.SL_pw= null,
    user_info.SSG_id= null,
    user_info.SSG_pw= null,
    user_info.createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    user_info.updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    user_info.save(function(err) {
      if (err) {
        console.log(i + "'s error is" + err);
      }
      console.log("[FINISH ENROLL USER'S INFO ABOUT ",user_id,"]");
      res.json("success");
    })
  });

  app.post('/api/check_duty',function(req,res){
    var user_id = req.body.user_id;
    user_resevered.find({
      user_id: user_id
    }, function(err, user_info) {
      // console.log(user_info);
      var lt_check=user_info[0].lotte_check;
      var sl_check=user_info[0].shilla_check;
      var ssg_check=user_info[0].ssg_check;
      var result = {
        lt_check:lt_check,
        sl_check:sl_check,
        ssg_check:ssg_check
      };
      res.json(result);
    });

  })

  app.post('/api/login_user', function(req, res){
    var user_id = req.body.user_id;
    console.log("[LOGIN USER BY ",user_id,"]");

    user_resevered.find({
      user_id: user_id
    }, function(err, user_info) {

      // console.log(user_info);
      res.json("Start check");
      async.parallel([
          function(callback){
            var options_lt =  {
               mode: 'text',
              pythonOptions: ['-u'],
              scriptPath: '',
              args: [user_info[0].LT_id,user_info[0].LT_pw]
             }
             if(user_info[0].LT_id!=null){
               PythonShell.run('./src/python/authDutyfree/checkLotteID.py', options_lt, function (err, results) {

                 if(err){
                   console.log("[ERROR CHECK LOTTE]",err);
                   callback("error",null);
                 }
                 else{
                   var result_list = results[0].split("/");

                  callback(null,result_list[1]);
                 }

               });
             }
             else{
               callback(null,null);
             }
          },
          function(callback){
            var options_sl =  {
               mode: 'text',
              pythonOptions: ['-u'],
              scriptPath: '',
              args: [user_info[0].SL_id,user_info[0].SL_pw]
             }
             if(user_info[0].SL_id!=null){
               PythonShell.run('./src/python/authDutyfree/checkShinlaID.py', options_sl, function (err, results) {
                 if(err){
                   console.log("[ERROR CHECK SL]",err);
                   callback("error",null);
                 }
                 else{
                   var result_list = results[0].split("/");

                  callback(null,result_list[1]);
                 }
               });
             }

            else{
              callback(null,null);
            }
          }
          ,
          function(callback){
            var options_ssg =  {
               mode: 'text',
              pythonOptions: ['-u'],
              scriptPath: '',
              args: [user_info[0].SSG_id,user_info[0].SSG_pw]
             }
             if(user_info[0].SSG_id!=null){
               PythonShell.run('./src/python/authDutyfree/checkShinsaegaeID.py', options_ssg, function (err, results) {
                 if(err){
                   console.log("[ERROR CHECK SSG]",err);
                   callback("error",null);
                 }
                 else{
                   var result_list = results[0].split("/");

                  callback(null,result_list[1]);
                 }
               });
             }
             else{
               callback(null,null);
             }
          }
        ],
        function(err, results_all) {
          var nowTime =  new Date().getTime();
          console.log(results_all);
          user_resevered.update({ user_id: user_id }, { $set: {updatedAt : nowTime ,
            LT_reserved:results_all[0], SL_reserved:results_all[1], SSG_reserved:results_all[2] } }, function(err, output){
               if(err) console.log("error : "+err);
               console.log(output);
           });
        });
    })
  })

  app.post('/api/refresh', function(req, res){
    var user_id = req.body.user_id;
    console.log("[",user_id," IS REQUEST REFRESH FUNCTION]");
    user_resevered.find({
      user_id: user_id
    }, function(err, user_info) {
      console.log(user_info);
      async.parallel([
          function(callback){
            var options_lt =  {
               mode: 'text',
              pythonOptions: ['-u'],
              scriptPath: '',
              args: [user_info[0].LT_id,user_info[0].LT_pw]
             }

            PythonShell.run('./src/python/authDutyfree/checkLotteID.py', options_lt, function (err, results) {
              // console.log("LT",results);
              if(err){

                callback("lt_error",null);
              }
              else{
                 var result_list = results[0].split("/");

                callback(null,result_list[1]);
              }

            });
          },
          function(callback){
            var options_sl =  {
               mode: 'text',
              pythonOptions: ['-u'],
              scriptPath: '',
              args: [user_info[0].SL_id,user_info[0].SL_pw]
             }
            PythonShell.run('./src/python/authDutyfree/checkShinlaID.py', options_sl, function (err, results) {
              // console.log("SL",results);
              if(err){
                callback("sl_error",null);
              }
              else{
                var result_list = results[0].split("/");

               callback(null,result_list[1]);
              }
            });
          }
          ,
          function(callback){
            var options_ssg =  {
               mode: 'text',
              pythonOptions: ['-u'],
              scriptPath: '',
              args: [user_info[0].SSG_id,user_info[0].SSG_pw]
             }
            PythonShell.run('./src/python/authDutyfree/checkShinsaegaeID.py', options_ssg, function (err, results) {
              // console.log("SSG",results);
              if(err){
                callback("ssg_error",null);
              }
              else{
                var result_list = results[0].split("/");

               callback(null,result_list[1]);
              }
            });
          }
        ],
        function(err, results_all) {
          // console.log("IN 최종부분");
          if(err){
            // console.log(err);
            res.json([0,0,0]);
          }
          else{
            var nowTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            user_resevered.update({ user_id: user_id }, { $set: {updatedAt : nowTime ,
              LT_reserved:results_all[0], SL_reserved:results_all[1], SSG_reserved:results_all[2] } }, function(err, output){
                 if(err) console.log("error : "+err);
                 // console.log(results_all);
                 res.json(results_all);
                 // console.log(output);
             });
          }

        });
    })
  })
}
