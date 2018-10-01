var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//사용자가 회원가입을 하면 user_reserved 데이터 생성
//연동이나 적립금을 확인 할때마다 update 실시
//메인서버에서는 요청만


var user_resevered = new Schema({
  user_id : String,
  lotte_check : Boolean,
  shilla_check : Boolean,
  ssg_check : Boolean,
  LT_reserved : String,
  SL_reserved : String,
  SSG_reserved : String,
  LT_id: String,
  LT_pw: String,
  SL_id: String,
  SL_pw: String,
  SSG_id: String,
  SSG_pw: String,
  createdAt: String,
  updatedAt: String
});




module.exports = mongoose.model('user_resevered', user_resevered);


//user_id, accesstoken, check, check_time, file_list
