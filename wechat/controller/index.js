var mongodb = require("../model/mongodb.js");

var Index = function(req,res,next){
    var list = null;
    mongodb._find("room",{},(err,result)=>{
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
                res.render("index",{"list" : list,"active":"index","userList":user});
            }
        });
       
    });    

}

module.exports = {Index};
