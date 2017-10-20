const {ObjectID} = require('mongodb');  //gives us isValid method, other methods also

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js')

//var id = '59e976e6f4781dbafb897e89';
//var id = '69e976e6f4781dbafb897e89';   //id not in collection
// var id = '59e976e6f4781dbafb897e8911';  //id invalid format
//
// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }



//Todo.find()  //query all
// Todo.find({   //query by -
//   _id: id  //mongoose will convert string to objectID
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({  //grabs first one that matches the query you have
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     console.log('Id not found');
//   }
//   console.log('Todo by ID', todo);
// }).catch((e) => {
//   console.log(e);
// });




//challenge
//handles id not found, found id, and invalid id (in that order here)
User.findById('59e80b4f4ba290b37445079c').then((user) => {
  if (!user) {
    return console.log('Unable to find user');
  }

  console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
  console.log(e);
});
