var file = require("../models/file.js");
var formidable = require('formidable');
var path   = require("path");
var fs  = require("fs");
var sd  = require('silly-datetime');
var querystring = require("querystring");

var showIndex = function(req,res){
   // res.send("65743");
    //res.render("index",{"album" : file.getAllAbulms()}); 函数是异步的
    //nodejs的编程思想 就是所有的东西否是异步的  所以 内层函数 不是return回来的数据
    //而是调用高层的函数提供的回调函数 把数据当做回调函数的参数来使用
    file.getAllAbulms(function(err,allAlbums){
       if(err) {
           res.send(err);
           return;
       }
        res.render("index",{
            "album" : allAlbums
        });
    });
}

//获取所有的相册图片
var showAlbum = function(req,res,next){
    var albumname = req.params.albumname;
    file.getAllPic(albumname,function(err,allImages){
         if(err) {
           //交给下面的中间件处理
           next();
           return;
       }

       res.render("pic",{
           "albumname" : albumname,
           "allImages" : allImages
       });
    });
};

//图片上传文件夹
var getAllFiles = function(req,res){
    file.getAllAbulms(function(err,allAlbums){
       if(err) {
           res.send(err);
           return;
       }
        res.render("up",{
            "filesName" : allAlbums
        });
    });
}

//图片上传
var uploadImage = function(req,res){
    //处理图片上传
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../temp/");
    
    form.parse(req, function(err, fields, files) {
        if(err){
            res.send("上传失败");
            return;
        }
        //res.writeHead(200, {'content-type': 'text/plain'});
        //判断图片大小
        // if(files.upImages.size > 2048){
        //     //删除图片
        //     fs.unlink(files.upImages.path);
        //     res.render("msg",{
        //         "msg" : '图片上传不能大于2M'
        //     });
        // }

        //判断是否存在文件夹
        fs.stat(path.normalize(__dirname + "/../uploads/" + fields.filename),function(err,stats){
            if(err){
                //删除图片
                fs.unlink(files.upImages.path);
                res.render("msg",{
                    "msg" : '不存在此文件夹'
                });
            }

            if(files.upImages.name == ""){
                res.render("msg",{
                    "msg" : '上传图片不能为空'
                });
            }

            if(stats.isDirectory()){
                //图片重命名和迁移
                var oldPath = files.upImages.path;
                var imageName = sd.format(new Date(), 'YYYYMMDDHHmmss') + parseInt(Math.random() * 99999);
                var newPath = path.normalize(__dirname + "/../uploads/" + fields.filename + '/') + imageName + path.extname(files.upImages.name);
                fs.rename(oldPath,newPath,(err)=>{
                    console.log(fields);
                    console.log(files);
                    //删除图片
                    fs.unlink(files.upImages.path,(err)=>{
                        res.end("删除图片失败"+files.upImages.path);
                    });
                    if(err){
                        //throw err;
                         res.render("msg",{
                         "msg" : '图片上传失败'
                         });
                    }
                    res.send("success");

                });
            }
            
        });
        
    });
 
    return;
}

//新增文件夹
var addFile = function(req,res){
    var formData = "";
    req.on("data",function(chunk){
        formData += chunk;
    });

    req.on("end",function(){
        formData = querystring.parse(formData);  //将一个字符串反序列化为一个对象
        // 设置响应头部信息及编码
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
        if(typeof formData.imageName != "undefined" ){
            //判断文件夹是否已经存在
            var pathFile = path.normalize(__dirname + "/../uploads/" + formData.imageName);
            fs.stat(pathFile,function(err,stats,next){
                 if(err){
                     //文件不存在则创建
                     fs.mkdir(pathFile,(err)=>{
                        if(err){
                            res.end("创建文件夹失败");
                        }
                     });
                 }
                if(stats.isDirectory()){
                    next();
                    return;
                    //res.end("文件已经存在");
                }
               
            });
            res.end("success");
        }else{
            res.end("文件名不能为空");
        }
    });
}

module.exports = {showIndex,showAlbum,getAllFiles,uploadImage,addFile};