const jwt = require('jsonwebtoken');

var data = {
  id: 11
};

//ceates hash, returns token value. second param is secret
var token = jwt.sign(data, 'abc123');
console.log(token);

//jwt.verify  //takes token and secret, and makes sure that was not manipulated
var decoded = jwt.verify(token, 'abc123');
console.log(decoded);



//this page is for learning, we won't be using cypto-js on our app
// const {SHA256} = require('crypto-js');
//
// var message = 'I am user number 3';
//
// var hash = SHA256(message).toString();  //SHA256 result is object
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);  //really long string
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
// console.log(token.hash);
//
// //token.data.id = 5;
// //token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// //if you hash something, you get same result every time
// //if you hash something with a randomly generated value, you get a diff result every time
// //this is salting
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// console.log(resultHash);
//
// if (resultHash === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log('Data was changed, don\'t trust');
// }
