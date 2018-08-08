var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var product_list = new Schema({
  prd_id : String,
  prd_Name: String,
  prd_Price: String,
  prd_1st: String,
  prd_2nd: String,
  prd_3rd: String,
  prd_Brand: String,
  prd_REF: String,
  prd_Brandref: String,
  prd_SLURL: String,
  prd_SSGURL: String,
  prd_IMGURL: String,
  prd_ProductURL: String,
  createdAt: String,
  updatedAt: String
});




module.exports = mongoose.model('product_list', product_list);


//user_id, accesstoken, check, check_time, file_list
