//引入一个文件
var People = require("./module/People");

var cym = new People('yomi',"女",25);
cym.sayHello();

//引入一个文件夹(每个模块文件夹中 推荐都写一个package（文件名字不能改）的json文件 放在模块文件的根目录下面 )
var bar = require("bar");

console.log(bar.msg);

//注意：
//require()中的路径 是从当前这个js的文件出发 找其他的文件
//但是 fs等其他的模块用到路径的时候 都是相对于cmd命令光标所在的路径 入股哦用到其他文件 使用绝对路径
