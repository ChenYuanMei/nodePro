//post请求提交 接收处理
var http = require("http");
var querystring= require("querystring");
console.log(6467427);
var server = http.createServer((req,res)=>{
    if(req.url == "dopost" && req.method.toLocaleLowerCase == 'post'){
        var allData = "";
        //post请求必须写的一个规则
        //接收一小段 可能就给别人去服务了  防止一个过大的表单阻塞整个进程
        req.addListener("data",function(chunk){
            allData += chunk;
        });
        //全部传输完毕
        req.addListener("end",function(){
            var dataString = allData.toString();
            console.log(allData.toString());
            res.end("success"); //回应客户端

            //将dataString 转为一个对象
            var dataobj = querystring.parse(dataString);
            console.log(dataobj);
        });
    }
}).listen(3000,"127.0.0.1");