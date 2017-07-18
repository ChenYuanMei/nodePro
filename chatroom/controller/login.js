var formidable = require('formidable');
var crypto = require("../model/Crypto.js");
var User = require("../model/User.js");
var Chat = require("../model/chat.js");

var Login = function(req,res,next){
    res.render("login");
}

var Register = function(req,res,next){
    res.render("register");
}
//注册接口
var RegisterPost = function(req,res,next){
    var form = new formidable.IncomingForm();

    form.parse(req,(err, fields)=>{
        //校验数据
        if(fields == {} || fields == null){
            res.json({"code":"-1","error":"请填写信息"});
            return;
        }

        this.username = fields.username.trim();
        this.password = fields.password.trim();
        this.repassword = fields.repassword.trim();
        this.email = fields.email.trim();

        if(this.username.length < 1){
            res.json({"code":"-1","error":"用户名不能为空"});
            return;
        }

        if(this.password.length < 1){
            res.json({"code":"-1","error":"密码不能为空"});
            return;
        }

        if(this.repassword.length < 1){
            res.json({"code":"-1","error":"第二次密码不能为空"});
            return;
        }

        //校验两个密码是否一致
        if(this.password != this.repassword){
            res.json({"code":"-1","error":"两次输入密码不一致"});
            return;
        }

        //插入数据
        var md5 = crypto.md5(this.password);
        var setpassword = md5.hash;
        var sort = md5.sort;

        var userModel = new User({
            "username":this.username,
            "password":setpassword,
            "sort":sort,
            "email":this.email
        });
        //查询是否已近存在此人todo
        userModel.find({"username" : this.username},(err,result)=>{
             if(err){
                res.json({"code":"-1","error":"服务器错误502"});
                return;
            }
            if(result.length > 0){
                //已近存在此用户
                res.json({"code":"-1","error":"该用户已经被注册"});
                return;
            }else{
                //新增注册用户
                userModel.save((err,result)=>{
                    //设置session
                    req.session.username = this.username;
                    res.json({"code":"1","message":"注册成功"});
                    return;
                });
            }
        });
    });
}

//登录接口
var LoginPost = function(req,res,next){
     var form = new formidable.IncomingForm();
     
     form.parse(req,(err,fields)=>{
        if(err){
             res.json({"code":"-1","error":err});
             return;
        }
        //校验数据
        if(fields == {} || fields == null){
            res.json({"code":"-1","error":"请填写信息"});
            return;
        }

        this.username = fields.username.trim();
        this.password = fields.password.trim();
        var userModel = new User();
        //查询是否存在此用户
        userModel.find({"username":this.username},(err,result)=>{
            if(err){
                res.json({"code":"-1","error":"服务器错误502"});
                return;
            }
            if(result.length < 1){
                res.json({"code":"-1","error":"不存在此用户 请注册"});
                return;
            }
            //校验密码
            var sort = result[0].sort;
            var setpassword = crypto.md5(this.password,sort,true);
            if(setpassword.hash != result[0].password){
                res.json({"code":"-1","error":"密码错误"});
                return;
            }
            
            req.session.username = this.username;
            res.json({"code":"1","message":"登录成功"});
                return;
        });
     });
}

module.exports = {Login,Register,RegisterPost,LoginPost};