const {SHA256} = require("crypto-js");
const jwt = require('jsonwebtoken');


var data = {
        id: 5
    };
var token = jwt.sign(data, 'abc123');
console.log(token); 

var decoded = jwt.verify(token, 'abc123');
console.log(decoded);
console.log(data);


// jwt.sign;
// jwt.verify;

// var message = 'new message to encrypt';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`hash: ${hash}`);


// var data = {
//     id: 5
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+ 'secret').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data)+ 'secret').toString()
// if(resultHash === token.hash){
//     console.log('verified');
// } else{
//     console.log('not same');
// }