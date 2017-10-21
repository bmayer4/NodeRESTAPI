var express = require('express');
var bodyParser = require('body-parser');  //converts JSON into object
const {ObjectID} = require('mongodb');  //gives us isValid method, among others

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());  //sending JSON to express application

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos: todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

//GET /toddos/1234324
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();  //send back empty body
    console.log('invalid id');
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      res.status(404).send();
      return console.log('Unable to find todo');
    }
    res.send({todo: todo});
  }).catch((e) => {
    res.status(400).send();   //intentially leave off error
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    console.log('invalid id');
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      res.status(404).send();
      return console.log('Unable to find todo');
    }
    res.send(`${todo} removed`);
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {
  app: app
};
