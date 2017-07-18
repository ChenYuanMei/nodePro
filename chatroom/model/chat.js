
var mongoose = require('mongoose');
//var operate  = require("./Common.js");
var db = require("./DbConnection.js");

 var chatSchema = mongoose.Schema({
    "username" : String,
    "content"  : String,
    "create_time" : {type:Date,default:Date.now}
 });
 var Chat = db.model("Chat",chatSchema);

module.exports = Chat;