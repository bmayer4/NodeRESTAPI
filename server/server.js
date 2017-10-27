require('./config/config.js');

const _ = require('lodash');  //to help w patch
const express = require('express');
const bodyParser = require('body-parser');  //converts JSON into object
const {ObjectID} = require('mongodb');  //gives us isValid method, among others

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
var port = process.env.PORT;  //set by heroku on production, or locally for development or test (config file)

app.use(bodyParser.json());  //sending JSON to express application

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//only returning todos that user who is logged in created
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({
      todos: todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});



app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();  //send back empty body
    console.log('invalid id');
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      res.status(404).send();
      return console.log('Unable to find todo');
    }
    res.send({todo: todo});
  }).catch((e) => {
    res.status(400).send();   //intentially leave off error
  });
});


app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    console.log('invalid id');
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      res.status(404).send();
      return console.log('Unable to find todo');
    }
    res.send({todo: todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);  //array of properties that you can pull off, if they exist, it
                                                      //creates an object composed of the picked object properties
                                                      //we don't want user to be able to update anything they choose
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user.id }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }
    res.send({todo: todo});
  }).catch((e) => {
    res.status(400).send();
  })

});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User({
    email: body.email,
    password: body.password
  });

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);  //send token back as http response header
  }).catch((e) => {
    res.status(400).send(e);
  })
});



app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {
  app: app
};
