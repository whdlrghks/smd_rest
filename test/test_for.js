var async = require('async');

async.waterfall([


    //Waterfallfunction 1
    function(callback) {
        var allitems = [];
        async.parallel([
                //Parallel 1
                function(callback) {
                    console.log("Waterfall 1 -> parallel 1");
                    async.each([1, 2, 3, 4, 5, 6], function(item, callback) {
                      console.log(item*3);
                        allitems.push(item * 3);
                        callback(null);
                    }, function() {callback(null)});
                },
                //Parallel 2
                function(callback) {
                    console.log("Waterfall 1 -> parallel 2");
                    async.each([1, 2, 3], function(item, callback) {
                      console.log(item * 3 * 9);
                        allitems.push(item * 3 * 9);
                        callback(null);
                    }, function() {callback(null)});
                },
                //Parallel 3
                function(callback) {
                    console.log("Waterfall 1 -> parallel 3");
                    async.each([1, 2, 3, 4, 5, 6, 7, 8, 9], function(item, callback) {
                      console.log(item * 2);
                        allitems.push(item * 2);
                        callback(null);
                    }, function() {callback(null)});
                }

            ],
            //Callback parallel completed
            function(err, results) {
                if (err) {
                    callback(err);
                }

                console.log("Waterfall 1 parallel completed");
                //I expect all item to be
                //[ 3, 6, 9, 12, 15, 18, 27, 54, 81, 2, 4, 6, 8, 10, 12, 14, 16, 18 ]
                console.log(allitems);
                // but it logs
                // [ 3, 6, 9, 12, 15, 18, 27, 54, 81 ]


                //pass allitems to the next function in waterfall
                callback(null, allitems);
            });
    },
    // Waterfallfunction2
    //calculate items length
    function(allitems, callback) {


        var itemlength = allitems.length;

        //pass itemlength to next function
        callback(null, itemlength);
    },

    //Waterfallfunction3
    //Log Message
    function(itemlength, callback) {

        console.log("The array is " + itemlength + " long");
        callback(null);
    }
],
//Callbackfunction on Waterfall completed
function(err, result) {
    if (err) {
        console.log(err);
    }
    console.log("operations completed!");

});


//
// var async = require("async")
// var k1 = 0;
// var k2=0;
// var test = function(callback){
//   ++k1;
//   for (var i = 0; i < 5; i++) {
//     setTimeout(function() {
//       for(var j =0 ; j < 5 ; j++){
//         if(i==4&&j==4){
//           callback(null,"finish");
//         }
//         else if (i % 3 == 0 && j %3==0) {
//           setTimeout(function() {
//             console.log("FINISH waiting");
//
//           }, 1000);
//         } else {
//           console.log("test : finish the index = ",k1,", i = ", i,",j = ",j);
//         }
//       }
//     }, 10);
//
//   }
// }
// var test2 = function(callback){
//   ++k2;
//   for (var i = 0; i < 5; i++) {
//     for(var j =0 ; j < 5 ; j++){
//       if(i==4&&j==4){
//         callback(null,"finish");
//       }
//       else if (i % 3 == 0 && j %3==0) {
//         setTimeout(function() {
//           console.log("FINISH waiting");
//
//         }, 1000);
//       } else {
//         console.log("test2 : finish the index = ",k2,", i = ", i,",j = ",j);
//       }
//     }
//   }
// }
//
// var tasks = {};
// for (var j = 0; j < 5; j++) {
//   if(j%2==0){
//     tasks['func' + j] = test2;
//   }
//   else {
//     tasks['func' + j] = test;
//   }
// }
// async.parallel(tasks,
// function(err, results){
//   console.log("===========================FINISH ALL TASK===================");
// })
//
// //
// //
// // var i = 0;
// // var async = require("async")
// // // task로 사용할 함수
// // var f = function(callback) {
// //   ++i;
// //   // 2의 배수일 경우 1초 후 callback 호출
// //   if (i % 2 === 0) {
// //     console.log('delay = ' + i);
// //     setTimeout(function() {
// //       callback(null, i);
// //       return;
// //     }, 1000);
// //   }
// //   // 2의 배수가 아닐 경우 즉시 callback 호출
// //   else {
// //     console.log('no delay = ' + i);
// //     callback(null, i);
// //   }
// // }
// // // 할당할 tasks 세팅
// // var tasks = {};
// // for (var j = 0; j < 5; j++) {
// //   tasks['func' + j] = f;
// // }
// // // parallel!
// //
// // async.parallel([
// //   function(callback){
// //     setTimeout(function() {
// //       console.log("FINISH THE 1");
// //       callback(null, "1");
// //       return;
// //     }, 250);
// //   },
// //   function(callback){
// //     setTimeout(function() {
// //       console.log("FINISH THE 2");
// //       callback(null, "2");
// //       return;
// //     }, 240);
// //   },
// //   function(callback){
// //     setTimeout(function() {
// //       console.log("FINISH THE 3");
// //       callback(null, "3");
// //       return;
// //     }, 230);
// //   },
// //   function(callback){
// //     setTimeout(function() {
// //       console.log("FINISH THE 4");
// //       callback(null, "4");
// //       return;
// //     }, 220);
// //   },
// //   function(callback){
// //     setTimeout(function() {
// //       console.log("FINISH THE 5");
// //       callback(null, "5");
// //       return;
// //     }, 200);
// //   },
// //   function(callback){
// //     setTimeout(function() {
// //       console.log("FINISH THE 6");
// //       callback(null, "6");
// //       return;
// //     }, 100);
// //   }
// // ],
// //
// //   // callback
// //
// //   function(err, results) {
// //
// //     console.log(results);
// //
// //   });
