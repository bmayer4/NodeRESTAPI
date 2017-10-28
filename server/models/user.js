const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      isAsync: false,
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

//instance method
UserSchema.methods.generateAuthToken = function() {  //arrow func doesn't bind to this keyword, this stores indiv doc
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id, access: access}, process.env.JWT_SECRET).toString();

  user.tokens.push({   //_id is generated here by mongodb
    access: access,
    token: token
  });

  return user.save().then(() => {  //return so we eventually chain a promise
    return token;    //return a value here, which will get passed as the success argument for the next then call
  });
};

UserSchema.methods.removeToken = function(token) {
  //$pull           //lets you remove items from an array that match certaim criteria
  var user = this;
  return user.update({  //return to chain
    $pull : {
      tokens: {       //pull from tokens array any object that has a token property equal to the token argument passed
        token: token  //whole object gets removed, even with id and access property, and token property
      }
    }
  });
};


//add model method
UserSchema.statics.findByToken = function(token) {
  var User = this;  //model methods get called with the model as the this binding
  var decoded;  //undedined because jwt.verify throws error if something goes wrong

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();   //simpler, gets handled by catch in server.js
  }

  return User.findOne({
    _id: decoded._id, //this is users id
    'tokens.token': token,            //to query a nested document
    'tokens.access': 'auth'
  });

};


UserSchema.statics.findByCredentials = function(email, password) {
  var user = this;
  return User.findOne({email: email}).then((user) => {
    if (!user) {
      return Promise.reject();  //will trigger catch case in server.js
    }
    //bcrypt only supports callbacks
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        res ? resolve(user) : reject();
      });
    });
  });
};

//will run some code before a given event
UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {   //boolean, don't want to hash already hashed password

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {

        user.password = hash;
        next();
      })
    });

  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);


module.exports = {
  User: User
};
