var http = require('http');
var url = require('url');
var fs  = require('fs');
var path = require('path');

http.createServer((req,res)=>{
    //得到用户的请求路径
    var pathname = url.parse(req.url).pathname;
    if(pathname == '/') pathname = 'index.html';
    //拓展名
    var extname = path.extname(pathname);
    //真正的 读取这个文件
    fs.readFile('./statics/'+pathname,(err,data)=>{
        if(err){
            //如果文件不存在返回404
            fs.readFile("./statics/404.html",(err,msg)=>{
                res.writeHead(404,{"Content-type":"text/html;charset=UTF8"});
                res.end(msg);
            });
            return;
        }
        var mime = getMime(extname);
        res.writeHead(200,{"Content-type":mime});
        res.end(data);
    });

}).listen(3000,'127.0.0.1');

function getMime(extname){
    var str = '';
    switch(extname){
        case ".html":
            str = "text/html";
            break;
        case ".jpg":
            str = "image/jpg";
            break;
        case '.css':
            str = "text/css";
            break;
    }
    return str;

}