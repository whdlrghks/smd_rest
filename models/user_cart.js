var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//사용자가 회원가입을 하면 user_reserved 데이터 생성
//연동이나 적립금을 확인 할때마다 update 실시
//메인서버에서는 요청만


var user_cart = new Schema({
  user_id : String,
  img_url : String,
  prd_url : String,
  prd_id : String,
  prd_name : String,
  storage : Boolean,
  duty_category : String,
  price : String,
  percent : String,
  createdAt: String,
  updatedAt: String
});




module.exports = mongoose.model('user_cart', user_cart);


//user_id, accesstoken, check, check_time, file_list
