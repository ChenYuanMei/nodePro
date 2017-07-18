'use strict';

// let username = 'cym';
// let password = '41531';

// (function($username,$password,$age){
//     console.log(username);
//     console.log(password);
// })(username,password);

let foo;
({foo} = {foo: 1}); // 成功

let baz;
({bar: baz} = {bar: 1}); // 成功

console.log(foo);
console.log(baz);
