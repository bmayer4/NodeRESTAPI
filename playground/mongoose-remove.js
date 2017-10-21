const {ObjectID} = require('mongodb');  //gives us isValid method, other methods also

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js')


//removes all, unlike find, must have curly braces that are empty
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//returns data
//Todo.findOneAndRemove({_id: '59eb9865b061c99f51a00104' }).then((todo) => {
//
//});

//returnsdata
Todo.findByIdAndRemove('59eb9865b061c99f51a00104').then((todo) => {
  console.log(todo);
});
