const {MongoClient, ObjectID} =  require('mongodb');

var url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, db) => {

  if (err) {
    return console.log('Unable to connect to the mongodb server');
  }

  console.log("Connected successfully to server");

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log('Deleted objects', result);
  // });

  //deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // })

  //findOneAndDelete   //remove individual item and returns those values
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  //challenge
  // db.collection('Users').deleteMany({name: 'Brett Mayer'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID('59e4c86a4a8d56ad9023da31') }).then((result) => {
    console.log(result);
  });

  //db.close();
});
