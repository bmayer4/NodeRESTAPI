var mongoose = require('mongoose');  //Required modules are cached and reused the next time the module is required.

//new mongoose.Schema from docs is not required
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,   //built in
    minLength: 1,     //built in
    trim: true    //built in, trim removes and leading or trailing white space
  },
  completed: {
    type: Boolean,
    default: false     //built in
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

// var newTodo = new Todo({
//   text: 'Cook dinner'
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved Todo', doc);
// }, (e) => {
//   console.log('Unable to save Todo', e);
// });

// var newTodo3 = new Todo({
//   text: 'Feed the cat',
//   completed: true,
//   completedAt: 123 //two minutes into the year 1970
// });
//
// newTodo3.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log(e);
// });

// var otherTodo = new Todo({
//   text: '  Did defaults and trim work?  ',
//
// });
//
// otherTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log(e);
// });

module.exports = {
  Todo: Todo
};
