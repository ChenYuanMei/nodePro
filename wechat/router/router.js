var fs = require("fs");
var path = require("path");
var files = require("../model/files.js");

var obj = new Object;
var fun = [];

//获取controller的所有控制器 同步回调
function getFiles(){
   var files = fs.readdirSync("./controller");
   if(files.length <= 0){
      throw new Error("没有文件");
   }
   for(var i = 0; i < files.length; i++){
      var stats = fs.statSync("./controller/" + files[i]);
      if(!stats.isFile){
        throw new Error("没有此文件" + files[i]);
      }
      var filename = path.basename(files[i],'.js');
      fun = require('../controller/' + files[i]);
      for(var k in fun){
        exports[k] = fun[k];
      }  
      
   }
}

getFiles();
