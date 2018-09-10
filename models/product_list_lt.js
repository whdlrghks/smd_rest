var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var product_list_test = new Schema({
  prd_id : String,
  prd_Name: String,
  prd_Price: String,
  prd_1st: String,
  prd_2nd: String,
  prd_3rd: String,
  prd_Brand: String,
  prd_REF: String,
  prd_SLURL: String,
  prd_SSGURL: String,
  prd_IMGURL: String,
  prd_ProductURL: String,
  createdAt: String,
  updatedAt: String
});

var product_list_lt = new Schema({
  prd_id : String,
  prd_Name: String,
  prd_Price: String,
  prd_1st: String,
  prd_2nd: String,
  prd_3rd: String,
  prd_Brand: String,
  prd_REF: String,
  prd_IMGURL: String,
  prd_LTURL: String,
  createdAt: String,
  updatedAt: String
});
var product_list_sl = new Schema({
  prd_id : String,
  prd_Name: String,
  prd_Price: String,
  prd_1st: String,
  prd_2nd: String,
  prd_3rd: String,
  prd_Brand: String,
  prd_REF: String,
  prd_SLURL: String,
  prd_IMGURL: String,
  createdAt: String,
  updatedAt: String
});
var product_list_ssg = new Schema({
  prd_id : String,
  prd_Name: String,
  prd_Price: String,
  prd_1st: String,
  prd_2nd: String,
  prd_3rd: String,
  prd_Brand: String,
  prd_REF: String,
  prd_SSGURL: String,
  prd_IMGURL: String,
  createdAt: String,
  updatedAt: String
});





module.exports = mongoose.model('product_list_lt', product_list_lt);


//user_id, accesstoken, check, check_time, file_list
