/* 用户数据集合 */
var mongoose = require('mongoose');
var operate  = require("./Common.js");
var db = require("./DbConnection.js"); 
//集合结构
var userSchema = mongoose.Schema({
    "username" : String,
    "email"    : {type : String, default : ""},
    "password" : String,
    "sort"     : String,
    "create_time": {type : Date, default : Date.now}
});

//查询方法
userSchema.methods.find = function(condition,callback){
    return this.model("User").find(condition,callback);
}
//model
var User = db.model("User",userSchema,"user");

module.exports = User;