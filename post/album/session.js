var express = require("express");
var app = express();
var session = require('express-session');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get("/",function(req,res){
    if(req.session.login){
        res.send("欢迎"+ req.session.username);
    }else{
        res.send("你还没有登录");
    }
});

app.get("/login",function(req,res){
    req.session.login = true;
    req.session.username = "yomi";
    res.send("你已经登陆！");

});

app.listen(3000);