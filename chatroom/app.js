var express = require("express");
var app     = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var router  = require("./router/router.js");
var session = require("express-session");
var path = require("path");



//设置模板引擎
app.set("view engine","ejs");

//设置静态引用地址
app.use(express.static("./public"));


//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));
//必须添加 视图才可以调用session
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});
//登录入口
app.get("/login",router.Login);
app.post("/login",router.LoginPost);
//注册页面
app.get("/register",router.Register);
app.post("/register",router.RegisterPost);

//聊天界面
app.get("/chat",router.WeChat);

app.get('/', function (req, res) {
    res.sendFile(path.normalize(__dirname + './views/chat.ejs') );
  //res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('newMessage', function (data) {
    var messageRe = {
        username : data.username,
        content  : data.message,
        dateTime : Date.now
    };
    socket.emit('message',messageRe);
  });
});



server.listen(3000);