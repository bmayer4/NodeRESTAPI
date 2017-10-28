const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');

const userOneId = new ObjectID();  //store in variable so you reference it several places
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'brett@example.com',
  password: 'userOnePassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'chelsi@example.com',
  password: 'userTwoPassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];


const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);  //return lets you chain promises. insertMany won't let us use middleware needed for
  }).then(() => {                  //hashing passwords for users seed data
    done();
  });
};

const populateUsers = (done) => {  //done is callback for mocha beforeEach needs
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();  //value that gets returned from save is a promise, userOne is
    var userTwo = new User(users[1]).save();  //and save will call the middleware

    return Promise.all([userOne, userTwo])
  }).then(() => {  //then won't get fired until all the promises resolve
    done();
  });
};

module.exports = {
  todos: todos,
  populateTodos: populateTodos,
  users: users,
  populateUsers: populateUsers
};
