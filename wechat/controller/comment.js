var mongodb = require("../model/mongodb.js");
var formidable = require("formidable");
var common  = require("../model/common.js");
var sd = require('silly-datetime');
var db = require("mongodb"); //引入mongodb


//评论说说
var Comment = function(req,res,next){
    var form = new formidable.IncomingForm();
    //判断是否登录
    if(!req.session.username){
        res.json({"code":"-1","error":"你还没有登录 还不能评论 <a href='/login'>去登陆</a>"});
        return;
    }else{
        //接收评论数据
        form.parse(req,(err,fileds)=>{
            if(err) throw err;
            //查询此条说说
            mongodb._find("room",{"_id": db.ObjectID.createFromHexString(fileds.id)},(err,result)=>{
                if(err) throw err;
                if(result.length < 0){
                    err = "没有此条说说";
                    throw err;
                } 

                var str = {"username":req.session.username,"message":fileds.comment,"create_time":sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')};
                //更新评论数据
                var comment =  [];
                if(typeof result[0].comment != "undefined"){
                    comment = result[0].comment;
                }
                comment.push(str);
                //更新数据
                var set = {$set:{"comment" : comment}};
                mongodb._update("room",{"_id": db.ObjectID.createFromHexString(fileds.id)},set,{},(err,rs)=>{
                    if(err) throw err;
                     return;
                });
                res.json({"code":"1","message":"评论成功!","username":req.session.username,"comment":fileds.comment});
                return;
            });
            return;
        });
    }
    return; 
}

//点赞操作
var CommentUpvote = function(req,res,next){
     var form = new formidable.IncomingForm();
    //判断是否登录
    if(!req.session.username){
        res.json({"code":"-1","error":"你还没有登录 还不能评论 <a href='/login'>去登陆</a>"});
        return;
    }else{
        form.parse(req,(err,fileds)=>{
            if(err) throw err;
            //查询此条说说
            mongodb._find("room",{"_id": db.ObjectID.createFromHexString(fileds.id)},(err,result)=>{
                if(err) throw err;
                if(result.length < 0){
                    err = "没有此条说说";
                    throw err;
                } 

                var upvote = 0;
                if(typeof result[0].upvote != "undefined"){
                    upvote = ++result[0].upvote;
                }else{
                    upvote = 1;
                }
                //更新数据
                var set = {$set:{"upvote" : upvote}};
                mongodb._update("room",{"_id": db.ObjectID.createFromHexString(fileds.id)},set,{},(err,rs)=>{
                    if(err) throw err;
                     return;
                });
                res.json({"code":"1","message":"已赞!","upvote" : upvote});
                return;
            });
            return;
        });
        return;
    }
}

module.exports = {Comment,CommentUpvote};