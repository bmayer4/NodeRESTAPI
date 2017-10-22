const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,   //bool
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//User will have model methods, like findByToken which we will create, doesn't exist on mongoose
//user will have instance methods, require individual document, like generateAuthToken()

//determines what exactly gets sent back when a mongoose model is converted into a json value
//we are overriding toJSON which already exists
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  //point of this is to leave off password and tokens array, which is sensative
  return _.pick(userObject, ['_id', 'email']);
};

//add instance methods
UserSchema.methods.generateAuthToken = function() {  //arrow func doesn't bind to this keyword, this stores indiv doc
  var user = this
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString();

  user.tokens.push({
    access: access,
    token: token
  });

  return user.save().then(() => {  //return so we eventually chain a promise
    return token;    //return a value here, which will get passed as the success argument for the next then call
  });
};

var User = mongoose.model('User', UserSchema);


module.exports = {
  User: User
}
