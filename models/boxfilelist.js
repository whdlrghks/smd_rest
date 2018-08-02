var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var User_dutyfree = new Schema({
  user_id : String,
  Lotte_id : String,
  Lotte_pw : String,
  Shilla_id : String,
  Shilla_pw : String,
  SSG_id : String,
  SSG_pw : String
});




module.exports = mongoose.model('User_dutyfree_info', User_dutyfree);


//user_id, accesstoken, check, check_time, file_list
