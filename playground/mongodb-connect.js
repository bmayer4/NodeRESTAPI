//const MongoClient = require('mongodb').MongoClient;
//const {MongoClient} =  require('mongodb');  //can do it this way, identical code
const {MongoClient, ObjectID} =  require('mongodb');
// var obj = new ObjectID();
// console.log(obj);  //creates new ID

//mongo won't create database until we add data to it
var url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, db) => {

  if (err) {
    return console.log('Unable to connect to the mongodb server');
  }

  console.log("Connected successfully to server");

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //
  // });

  // db.collection('Users').insertOne({
  //   name: 'Brett Mayer',
  //   age: 32,
  //   location: 'Boca'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert User', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(JSON.stringify(result.ops[0]._id, undefined, 2));
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  //
  // });

  db.close();
});
