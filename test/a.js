/* console.log(__dirname);
console.log(__filename);
console.log(path.dirname(__filename)); */

// var argv = process.argv;

// console.log(argv);

// var argv = process.argv;

//回调
console.time('main');
function asny(number,callback){
    if(typeof number == 'number'){
        if(number % 2){
            callback(null,'这是一个偶数');
        }else{
            callback(null,'这是一个奇数');
        }
    }else{
        callback(new Error('不是一个数字'));
    }
}

console.timeEnd('main');

asny(10,function callback(error,msg){
    if(error){
        console.log(error);
        return false;
    }else
        console.log(msg);
});
asny(11,function callback(error,msg){
    if(error){
        console.log(error);
        return false;
    }else
        console.log(msg);
});
asny('YRUTRU',function callback(error,msg){
    if(error){
        console.log(error);
        return false;
    }else
        console.log(msg);
});

