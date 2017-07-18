var express = require("express");
var app = express();

var MongoClient = require("mongodb").MongoClient;

app.get("/",function(req,res){
    var url = "mongodb://127.0.0.1:27017/cym";
    MongoClient.connect(url,function(err,db){
        db.collection("cym").insert({
            "name" : "testhahah",
            "data" : "345gfdgfdshjgs"
        },function(err,result){
            if(err)
            {
                console.log("插入数据失败");
                return;
            }
            res.send(result);
            db.close();
        })
    });
    
});

app.listen(3000);