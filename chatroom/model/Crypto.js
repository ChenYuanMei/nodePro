const crypto = require('crypto');

//获取随机字符串
function getRondom(size = 6){
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxLen = chars.length + 1;
    var new_pass = "";
    while (size > 0) {
        new_pass += chars.charAt(Math.floor(Math.random() * maxLen));
        size--;
    }

    return new_pass;
}

//生成md5加密
var md5 = function(str,sort = null,flag = false){
    var hash = crypto.createHash("md5");
    sort = flag == true ? sort : getRondom();

    return {"hash" : hash.update(str+sort).digest('hex'),"sort" : sort};
}

module.exports = {md5};