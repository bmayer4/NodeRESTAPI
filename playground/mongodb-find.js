const {MongoClient, ObjectID} =  require('mongodb');

var url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, db) => {

  if (err) {
    return console.log('Unable to connect to the mongodb server');
  }

  console.log("Connected successfully to server");

  // db.collection('Todos').find({
  //   _id: new ObjectID('59e42efcf27b52aa51ede868')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find({}).count().then((count) => {
  // console.log('Todos:', count);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({name: 'Brett Mayer'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
    var a = 'Oscar';
    var b = 'Mayer';
    console.log(a, b);  //automatically adds a space
  })

  //db.close();
});
