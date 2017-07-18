//同步处理 读取文件夹
var http = require('http');
var fs   = require('fs');

var server = http.createServer((req,res)=>{
    //不处理收藏小图标
    if(req.url == '/favicon.ico') return;
    //读取所有的文件夹
    fs.readdir("./album",(err,files)=>{
        var fileDir = [];
        //迭代的使用 类似回调函数
        (function iterator(i){
            if(i == files.length) {
                console.log(fileDir);
               return; 
            }
            fs.stat("./album"+files[i],(err,stats)=>{
                //检测成功后做的事情
                if(stats.isDirectory()){
                    //如果是个文件夹 那么就放入数组
                    fileDir.push(files[i]);
                }
                iterator(i++);
            });
           
        })(0);
    });

    res.end();
});

server.listen(3000,"127.0.0.1");