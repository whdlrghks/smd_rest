var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var product_lt_ssg = new Schema({
  prd_id_lt : String,
  prd_id_ssg: [String]
});




module.exports = mongoose.model('product_lt_ssg', product_lt_ssg);


//user_id, accesstoken, check, check_time, file_list
