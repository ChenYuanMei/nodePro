//自动转化成markdown文件

const fs = require('fs');
const path = require('path');

//接收需要转换的文件路径
const target = path.join(__dirname,process.argv[2] || '../README.md');

//监听文件变化
fs.watchFile(target,(curr,prve)=>{
    console.log(curr.size,prve.size);
});

