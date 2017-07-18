/* 数据库连接操作 */
var mongoose = require('mongoose');
 mongoose.Promise = global.Promise;
//链接数据库
var db = mongoose.createConnection('mongodb://localhost/chat');

db.on("error",console.error.bind(console,"mongoose connnection fail"));

db.once("open",function(callback){
    console.log("mongoose success");
});

module.exports = db;