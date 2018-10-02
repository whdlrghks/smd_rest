var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//사용자가 회원가입을 하면 user_reserved 데이터 생성
//연동이나 적립금을 확인 할때마다 update 실시
//메인서버에서는 요청만


var review_product = new Schema({
  prd_id : String,
  user_id : String,
  user_username : String,
  rating : String,
  content : String,
  createdAt: String
});




module.exports = mongoose.model('review_product', review_product);


//user_id, accesstoken, check, check_time, file_list
