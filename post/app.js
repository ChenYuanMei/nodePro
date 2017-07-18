var express = require("express");
var app = express();

app.all("/test",(req,res)=>{
    res.send("进来了");
}).listen(3000);