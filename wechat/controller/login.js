var mongodb = require("../model/mongodb.js");
var formidable = require("formidable");
var common  = require("../model/common.js");
var sd = require('silly-datetime');

//登录页面
var LoginIndex = function(req,res,next){
    res.render("login");
}

//注册页面
var LoginRegister = function(req,res,next){
    res.render("register");
}

//登录验证
var LoginPerson = function(req,res,next){
    var form = new formidable.IncomingForm();

    form.parse(req,(err,fields)=>{
        //检查数据库
        this.username = fields.username;
        this.password = fields.password;

        //检查数据是否有此用户
        mongodb._find("user",{"username" : this.username},function(err,result){
            if(result.length <= 0){
                res.json({"code":"-1","error":"没有此用户"});
                return;
            }
            //检查密码是否一致
            var md5Str =  common.md5(this.password,result[0].sort,true);
            if(md5Str.hash != result[0].password){
                res.json({"code":"-2","error":"密码错误"});
                return;
            }
            //检查是否记住密码
            if(fields.rememberme == "1"){
                req.session.cookie.secure = true; 
                req.session.cookie.maxAge = parseInt(10 * 60 * 60 * 24 * 7);
            }
            req.session.username = this.username;
            req.session.picture  = typeof result[0].picture != "undefined" ?  result[0].picture : "/images/default.jpg" ;
            req.session.sign  = typeof result[0].sign != "undefined" ?  result[0].sign : "你还没有个性签名呢" ;

            res.json({"code" : "1","message" : "success"});
            return;
 
        });
    });

    return;
}

//退出登录
var Layout = function(req,res,next){
    //销毁所有的session
    req.session.destroy(function(err) {
        if(err) throw err;
    });
     res.render("login");

}

module.exports = {LoginIndex,LoginRegister,LoginPerson,Layout};
