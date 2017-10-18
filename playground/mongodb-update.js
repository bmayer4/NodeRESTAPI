const {MongoClient, ObjectID} =  require('mongodb');

var url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, db) => {

  if (err) {
    return console.log('Unable to connect to the mongodb server');
  }

  console.log("Connected successfully to server");

  //findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('59e66ebcb061c99f519fa90c')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // })
  // .then(() => {
  // });

  //challenge
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('59e66c7db061c99f519fa87c')
  }, {
    $set: {
      name: 'Brett just edited!'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  })
  .then((result) => {
    console.log(result);
  });

  //db.close();
});
