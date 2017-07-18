var user = {
    'admin': '123456',
    'cym'  : '121212'
};

var flag = true;
var userName = '';

process.stdout.write('请输入用户名：'+'\n');

process.stdin.on('data',(input) => {

    input = input.toString().trim();
    if(flag && !userName){
        if(Object.keys(user).indexOf(input) === -1){
            process.stdout.write('不存在此用户!');
            process.exit();
        }else {
             process.stdout.write('请输入密码：\n');
             userName = input;
             flag = false;
        }
    }else{
        if(user[userName] === input){
           console.log('登陆成功');
        }else{
           process.stdout.write('请输入密码：\n'); 
        }
    }

    
})