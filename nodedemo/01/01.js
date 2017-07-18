//require标识引包 引包就是引用自己的一个特殊功能
var http = require('http');
var fs   = require('fs');

//创建服务器 参数是一个回调函数 表示如果有请求进来 要做什么
var server = http.createServer(function(req,res){
    if(req.url == '/test'){
        //读取文件内容 data为文件的内容
        fs.readFile('./test.html',(err,data)=>{
            //req 表示请求 request  res表示响应 response
            //设置HTTP 头部 状态码200 文件类型html 字符集utf8
            res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"});
            res.end(data);
        });
    }else if(req.url == '/rediu'){
        //读取文件内容 data为文件的内容
        fs.readFile('./rediu.html',(err,data)=>{
            //req 表示请求 request  res表示响应 response
            //设置HTTP 头部 状态码200 文件类型html 字符集utf8
            res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"});
            res.end(data);
        });
    }else{
        //读取文件内容 data为文件的内容
        res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"});
        res.end('404  没有页面');   
    }

});
//运行服务器 监听3000端口
server.listen(3000,'127.0.0.1');