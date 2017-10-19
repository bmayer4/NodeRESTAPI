var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  }
});

// var aUser = new User({
//   email: ' brett@test.com   '
// });
//
// aUser.save().then((doc) => {
//   console.log(doc);
// }, (e) => {
//   console.log(e);
// })


module.exports = {
  User: User
}
