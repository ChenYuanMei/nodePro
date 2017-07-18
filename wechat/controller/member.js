var mongodb = require("../model/mongodb.js");
var formidable = require("formidable");
var common  = require("../model/common.js");
var sd = require('silly-datetime');
var path = require("path");
var fs = require("fs");
var gm = require('gm');


//用户注册事件
var MemberRegister = function(req,res,next){
    var form = new formidable.IncomingForm();
    //接收参数
    form.parse(req,(err, fields)=>{
        this.username = fields.username;
        this.password = fields.password;
        this.repassword = fields.repassword;

        //比较两密码是否一致
        if(this.password != this.repassword){
            res.json({"code" : "-1","error" : "两个密码不一致"});
            return;
        }
        //查询数据库是否已经存在此用户
        mongodb._find("user",{"username" : this.username},function(err,result){
            if(err){
                res.json({"code" : "-500","error" : err});
                return;
            } 
            if(result.length != 0) res.json({"code" : "-2","error" : "此用户已经被注册"});
            return;
        });
        
        var md5Str =  common.md5(this.password);
        var passmd = md5Str.hash;
        var create_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        //插入数据库
        var insertData = {"username" : username,"password" : passmd,"sort": md5Str.sort,"create_time":create_time};
        mongodb._insert("user",insertData,function(err,result){
            if(err){
                res.json({"code" : "-500","error" : err});
                return;
            } 
            //数据插入成功
            if(result){
                //设置session存储
                req.session.username = this.username;
                res.json({"code" : "1","message" : "success"});
                return;
            }
        });
        return;

    });
}

//我的说说
var MemberOwner = function(req,res,next){
    //检查是否已经登录
    if(!req.session.username){
        res.render("login");
    }else{
        //获取所有的说说
        var where = {"username":req.session.username};
        var list = null;
        mongodb._find("room",where,(err,result)=>{
            if(err) throw err;
            list = result;
            for(var i = 0; i < list.length;i++){
                if(typeof list[i].comment == "undefined"){
                    list[i].comment = [];
                }
                if(typeof list[i].upvote == "undefined"){
                    list[i].upvote = 0;
                }
            }
            res.render("owner",{"list" : list,"active":"owner"});
        });    
    }
    return;
}

//说说发表
var MemberMoon = function(req,res,next){
    var form = new formidable.IncomingForm();

    form.parse(req,(err,fields)=>{
        if(err){
            res.json({"code":"-500","error":err});
            return;
        }
        var content = fields.content.trim();
        var create_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

        if(content.length == 0){
            res.redirect();
            return;
        }else{
            //发表说说
            var insert = {"username" : req.session.username,"content":content,"create_time":create_time};
            mongodb._insert("room",insert,(err,result)=>{
                if(err){
                    res.redirect();
                    return;
                }
            });
            res.json(insert);
            return;
        }
       
    });
    return;
}

//个人设置
var MemberAccount = function(req,res,next){
    if(!req.session.username){
        res.render("login");
    }else{
        res.render("person",{"active":"setaccount"});
    }
}

//图片剪切
var MemberCropper = function(req,res,next){
    if(!req.session.username){
        res.render("login");
    }else{
        res.render("images");
    }
    
}

//图片上传
var MemberUploads = function(req,res,next){
    if(!req.session.username){
        res.render("login");
        return;
    }else{
        var form = new formidable.IncomingForm();
        form.uploadDir = path.normalize(__dirname + "/../uploads/temp/");

        form.parse(req,(err,fields,files)=>{
            if(err){
                res.redirect();
                return;
            }

            this.x = fields.x;
            this.y = fields.y;
            this.width = fields.width;
            this.height = fields.height;

            var create_time = sd.format(new Date(), 'YYYYMMDDHHmmss') + parseInt(Math.random() * 999999);

            //获取图片
            fs.stat(path.normalize(__dirname + "/../uploads/temp/"),function(err,stats){
                if(err){
                    //删除图片
                    fs.unlink(files.file.path);
                    res.redirect();
                    return;
                }
                //判断是否存在上传文件
                if(files.file.name == ""){
                     //删除图片
                    fs.unlink(files.file.path);
                    res.render("person",{"active":"setaccount"});
                    return;
                }
                var extname = path.extname(files.file.name);
                var oldname = files.file.path;
                var newname = path.normalize(__dirname + "/../uploads/temp/temp_" + create_time + extname);

                fs.rename(oldname,newname,(err)=>{
                    if(err){
                        throw err;
                    }
                    return;
                });
                //剪切图片
                if(stats.isDirectory()){
                    //判断是否assets文件夹
                    fs.stat(path.normalize(__dirname + "/../uploads/assets/"),(err,statIs)=>{
                        if(statIs.isDirectory()){
                            var writeStream = fs.createWriteStream(path.normalize(__dirname + "/../uploads/assets/"+ req.session.username + create_time + extname));
                           gm(newname)
                            .crop(this.width,this.height,this.x,this.y)
                            .resize(176,117)
                            .write(path.normalize(__dirname + "/../uploads/assets/"+ req.session.username + create_time + extname),function(error){
                               if (error) {
                                    res.send(err);
                                    return;
                                }

                                var picture = path.normalize("/assets/"+ req.session.username + create_time + extname);
                                //成功后写入数据库
                                mongodb._update("user",{"username" : req.session.username},{$set:{"picture":picture}},{},(err,result)=>{
                                    if(err){
                                        res.send({"error" : "更改头像失败"});
                                        return;
                                    }
                                    if(result.length > 0){
                                        fs.unlink(newname);
                                        return;
                                    }
                                    req.session.picture  = picture;
                                    res.render("person",{"active":"setaccount"});
                                    return;
                                });
                                return;
                            });
                            return;
                        }else{
                            res.send({"error" : "不存在此文件夹"});
                            return;
                        }
                    });
                    return;
                }else{
                    res.render("person",{"active":"setaccount"});
                    return;
                } 
            });
            return;
        });
    }
    
    return;
}

//修改账户信息
var MemberSetInfo = function(req,res,next){
    //判断是否登录
     if(!req.session.username){
        res.render("login");
        return;
    }

    var form = new formidable.IncomingForm();

    form.parse(req,(err,fields)=>{
        if(fields.length <= 0 )
        {
            res.json({"code":"-1"});
            return;
        }

        this.oldpassword = fields.oldpassword.trim();
        this.newpassword = fields.newpassword.trim();
        this.againpassword = fields.againpassword.trim();
        this.sign = fields.sign.trim();

        //获取当前用户
        mongodb._find("user",{"username" : req.session.username},function(err,result){
            if(result.length <= 0){
                res.render("login");
                return;
            }
            var set = null;
            if(this.sign.length > 0){
                set = {
                    "sign" : this.sign
                };
            }
            //修改密码
            if(this.oldpassword.length > 0){
                //检查密码是否一致
                var md5Str =  common.md5(this.oldpassword,result[0].sort,true);
                if(md5Str.hash != result[0].password){
                    res.json({"code":"-1","error" : "旧密码不对"});
                    return;
                }
               
                if(this.newpassword.length > 0 && this.againpassword.length > 0 && this.newpassword == this.againpassword){
                    //修改密码
                    var md5Str =  common.md5(this.newpassword);
                    var newpass = md5Str.hash;
                    var newsort = md5Str.sort;

                    set = {
                        "password" : newpass,
                        "sort" : newsort
                    };
                }else{
                    res.json({"code":"-1","error" : "两次输入密码不正确"});
                    return;
                }
            }
             //更新数据
            if(set != null){
                mongodb._update("user",{"username" : req.session.username},{$set:set},{},(err,result)=>{
                    if(err){
                        res.json({"code":"-1","error" : "修改密码失败"});
                        return;
                    }else{
                        if(this.sign.length > 0) req.session.sign = this.sign;
                        res.json({"code":"1","message" : "保存成功"});
                        return;
                    }
                   
                });
            }else{
                res.json({"code":"-1"});
                return;
            }
           
        });
      
    });
}

//获取某人信息
var MemberGetUser = function(req,res,next){
    var username = req.query.username;
    var list = null;
    //查询此用户
    mongodb._find("room",{"username" : username},(err,result)=>{
        list = result;
        for(var i = 0; i < list.length;i++){
            if(typeof list[i].comment == "undefined"){
                list[i].comment = [];
            }
            if(typeof list[i].upvote == "undefined"){
                list[i].upvote = 0;
            }
        }
        //获取用户列表
        var user = [];
        mongodb._find("user",{},(err,userList)=>{
            if(err) throw err;
            if(userList.length > 0){
                for(var i = 0; i < userList.length;i++){
                    if(userList[i].username == req.session.username){
                        delete userList[i];
                    }else{
                        user[i] = userList[i].username;
                    }
                }
                res.render("user",{"active":"user","username":username,"list" : list,"userList":user});
            }
        });
        
    });

}
module.exports = {MemberRegister,MemberOwner,MemberMoon,MemberAccount,MemberCropper,MemberUploads,MemberSetInfo,MemberGetUser};