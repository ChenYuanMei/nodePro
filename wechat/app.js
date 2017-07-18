var express = require("express");
var app = express();
var router = require("./router/router.js");
var session = require("express-session");
var cookieParser = require('cookie-parser');

app.set("view engine","ejs");
app.use(express.static("./statics"));
app.use(express.static("./uploads"));
//使用cookie
app.use(cookieParser());
//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

//访问首页
app.get("/",router.Index);

//登录页面
app.get("/login",router.LoginIndex);

//注册页面
app.get("/register",router.LoginRegister);

//注册页面请求
app.post("/member",router.MemberRegister);

//登录入口
app.post("/person",router.LoginPerson);

//退出登录
app.get("/layout",router.Layout);

//我的说说
app.get("/owner",router.MemberOwner);

//个人空间说说发表
app.post("/personsub",router.MemberMoon);

//评论
app.post("/comment",router.Comment);

//点赞
app.post("/upvote",router.CommentUpvote);

//个人设置
app.get("/setaccount",router.MemberAccount);

//图片剪切
app.get("/cropper",router.MemberCropper);

//图片上传
app.get("/uploads",router.MemberUploads);
app.post("/uploads",router.MemberUploads);

//修改个人信息
app.post("/setaccount",router.MemberSetInfo);

//获取个人说说
app.get("/user",router.MemberGetUser);

app.listen(3000);