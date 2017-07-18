//node开发服务器的阻塞情况
'use strict';
//V8 对ES6支持情况氛围三个级别：根本不支持 直接支持 严格模式支持
const http = require('http');

let count = 0;
const server = http.createServer((req,res) => {
    //此回调会在有任何用户请求触发
    res.write(`你是第个${count++}访问用户`);
    res.end();
});

server.listen(2080,(error) =>{
    if(error)
        throw error;
        console.log('成功启动web服务，端口：2080');
});