var fs = require("fs");
var path = require("path");

var getFiles = function(callback){
    fs.readdir("./controller",function(err,files){
        if(err) {
            callback("没有此文件夹",null);
            return;
        }
        var allFiles = [];
        (function iterator(i){
            if(i == files.length){
                callback(null,allFiles);
                return;
            }
            fs.stat("./controller/" + files[i],function(err,stats){
                if(err){
                    callback(err,null);
                    return;
                }
                if(stats.isFile){
                    allFiles.push(files[i]);
                }

                iterator(i + 1);            
            });

        })(0);
    });
    
}

//var getAllFiles = 

// getFiles(function(err,filesArr){
//     console.log(45635736585);
//     if(err) throw err;
//     for(var i = 0; i < filesArr.length; i++){
//         //获取文件名
//         var filename = path.basename(filesArr[i],'.js');
//         fun = require('../controller/' + filesArr[i]);
//         for(var k in fun){
//            obj[k] = fun[k];
//         }  
//     }
//     console.log(obj);
//     return obj;
// });

module.exports = {getFiles};