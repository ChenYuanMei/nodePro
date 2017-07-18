var express = require("express");
var app = express();
var db  = require("./models/mongodb.js");
var formidable = require("formidable");
var sd = require("silly-datetime");

app.set("view engine","ejs");
app.use(express.static("./public"));

app.get("/",function(req,res,next){
    res.render("message");
});

app.get("/send",function(req,res,next){
    res.render("publish");
});

app.post("/send",function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){
            res.end("发表失败");
        }
        //插入mongodb
        var newsID = sd.format(new Date(),"YYYYMMDDHHmmss") + parseInt(Math.random() * 99999);
        db._insert("zone",{newsID:newsID,title:fields.title,username:fields.luncher,content:fields.content,publishTime:new Date().getTime(),datetime:sd.format(new Date(),"YYYY-MM-DD HH:mm:ss")},function(err,result){
            if(err){
                console.log(err);
                res.end("发表失败");
            }
           // console.log(result);
            res.end("success");
            // res.render("list");
        });
    });
});

app.get("/list",function(req,res,next){
    //查询所有的内容
    db._find("zone",{},20,0,function(err,result){
        var data = [];
        //查询回复
        (function iterator(j){ 
            if(j == result.length){
                res.render("list",{"list" : data});
                return;
            };
            db._find("message",{"newsID" : result[j].newsID},20,0,function(err,info){
                if(info != null){
                    result[j].message = info;
                    data.push(result[j]); 
                }
                iterator(j+1);
            }); 
        })(0);
        return;
    });
    

});

app.post("/list",function(req,res,next){
    //接收参数
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){
            console.log(err);
            res.json({"success" : false,"message" : '评论失败'}); 
        }
        //插入数据库
        db._insert("message",{newsID:fields.newsID,content:fields.content,publishTime:new Date().getTime(),datetime:sd.format(new Date(),"YYYY-MM-DD HH:mm:ss")},function(err,result){
            if(err){
                res.json({"success" : false,"message" : '评论失败'}); 
            }
            res.json({"success" : true,"message" : '评论成功',"content" : fields.content}); 
        });
         
    });
});
//错误路由
app.use(function(req,res){
    res.render("error");
});



app.listen(3000);
