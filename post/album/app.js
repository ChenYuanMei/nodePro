var express = require("express");
var router  = require("./controller");
var app = express();

app.set("view engine","ejs");
//路由中间件 
app.use(express.static("./public")); //提供静态服务的
app.use(express.static("./uploads")); //静态访问图片信息

app.get("/",router.showIndex);  //设置默认的访问页面

app.get("/:albumname",router.showAlbum);

app.get("/up",router.getAllFiles);
app.post("/up",router.uploadImage);

app.post("/addfile",router.addFile);

//错误路由
app.use(function(req,res){
    res.render("error");
});

app.listen(3000);