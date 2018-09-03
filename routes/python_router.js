var async = require('async'), mime = require('mime');
var PythonShell = require('python-shell');
module.exports = function(app) {
  app.post('/api/checklottemembership', function(req, res){
    var options = req.body;
    PythonShell.run('./src/python/authDutyfree/checkLotteID.py', options, function (err, results) {
      if (err) throw err;
       if(results=='lotte success'){
         console.log(results);
         res.json(results);
       }
       else{
         res.json(results);
       }
    });
  })

  app.post('/api/checkshinlamembership', function(req, res){
    var options = req.body;
    PythonShell.run('./src/python/authDutyfree/checkShinlaID.py', options, function (err, results) {
      if (err) throw err;
       if(results=='shinla success'){
         res.json(results);
       }
       else{
         res.json(results);
       }
    });
  })

  app.post('/api/checkssgmembership', function(req, res){
    var options = req.body;
    try{
      PythonShell.run('./src/python/authDutyfree/checkShinsaegaeID.py', options, function (err, results) {
        if (err) throw err;
         if(results=='ssg success'){
           res.json(results);
         }
         else{
           res.json(results);
         }
      });
    }
    catch(err){
      console.log("[SSG] IT HAS SOME ERROR ABOUT PYTHON GET SSG RESERVED",err);
    };

  })

  app.post('/api/getltreserved', function(req, res){
    var options = req.body;
    PythonShell.run('./src/python/reserveDutyfree/getLotte.py', options, function (err, results) {
      console.log("GET USER LOTTE MEMBERSHIP RESERVED POINT : " +results);
      if (err) throw err;
      res.json(results);
    });
  })

  app.post('/api/getslreserved', function(req, res){
    var options = req.body;
    PythonShell.run('./src/python/reserveDutyfree/getShinla.py', options, function (err, results) {
      console.log("GET USER SHINLA MEMBERSHIP RESERVED POINT : " +results);
      if (err) throw err;
      res.json(results);
    });
  })

  app.post('/api/getssgreserved', function(req, res){
    var options = req.body;
    PythonShell.run('./src/python/reserveDutyfree/getSSG.py', options, function (err, results) {
      console.log("GET USER SSG MEMBERSHIP RESERVED POINT : " +results);
      if (err) throw err;
      res.json(results);
    });
  })
}
