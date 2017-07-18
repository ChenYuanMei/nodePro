
var argvs = process.argv;
console.log(argvs[3]);

var sum = 0;
process.argv.forEach((val,index,array)=>{
    if(index >= 2){
        var num = val.toString().trim();
        num = parseFloat(num);
        if(typeof num == 'number'){
         sum += num; 
        }else{
            console.log(`${val}不是数字，请输入一个数字`);
            return;
        }
    }else{
        console.log('请输入参数');
        return;
    }
});

console.log(sum);