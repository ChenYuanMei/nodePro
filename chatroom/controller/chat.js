var User = require("../model/User.js");
var path = require("path");
var WeChat = function(req,res,next){
    if(!req.session.username){
        res.redirect("/login");
        return;
    }else{
        //获取所有的用户
        var userModel = new User();
        userModel.find({},(err,result)=>{
            var userList = result || [];
            var currUser = req.session.username;
            return res.render("chat",{"currUser":currUser,"userList":userList});

        });
    }
    

}

module.exports = {WeChat};