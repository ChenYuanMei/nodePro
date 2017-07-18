var fs = require("fs");

var getAllAbulms = function(callback){
    fs.readdir("./uploads",function(err,files){
        if(err) {
            callback("没有此文件夹",null);
            return;
        }
        var allAlbums = [];
        //迭代器
        (function iterator(i){
            if(i == files.length) {
                 callback(null,allAlbums);
                 return;
            }
            fs.stat("./uploads/"+files[i],function(err,stats){
                if(err) throw err;
                if(stats.isDirectory()){
                    allAlbums.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
}

var getAllPic =  function(ablumname ,callback){
    fs.readdir("./uploads/" + ablumname,function(err,files){
        if(err) {
            callback("没有此文件夹",null);
            return;
        }
        var allAlbumsPic = [];
        //迭代器
        (function iterator(i){
            if(i == files.length) {
                 callback(null,allAlbumsPic);
                 return;
            }
            fs.stat("./uploads/"+ ablumname + '/'+ files[i],function(err,stats){
                if(err) throw err;
                if(stats.isFile()){
                    allAlbumsPic.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
}

module.exports = {getAllAbulms,getAllPic};
