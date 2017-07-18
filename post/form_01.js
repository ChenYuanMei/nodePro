var express = require("express");

var app = express();

//设置模板引擎
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("form");
});

app.post("/",(req,res)=>{
    res.end("646427");
   // res.render("form");
   //自定义设置页面错误编码
   //res.status(404).send("没有这个页面");
   //自定义设置使用不同的Content-Type
   //res.set("Content-Type","text/html");
   //设置视图
   //app.set("views","myview");
});

app.listen(3000);