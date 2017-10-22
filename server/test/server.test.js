const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
//https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/questions/2614939

//var app = require('./server.js').app;   ES6 destructuring below, same
var {app} = require('./../server.js')   //     ./ is relative path, then back one directory
const {Todo} = require('./../models/todo.js');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

//testing lifecycle method, runs code before every test case
//here, make sure database is empty
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);  //return lets you chain promises
  }).then(() => {
    done();
  })
});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
    .post('/todos')
    .send({text: text})   //sends data along w the request, as the body. supertest converts this to JSON
    .expect(200)
    .expect((res) => {      //custom expect assertion
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => { ///OOOOOOOOOHH - look at block
      if (err) {
        return done(err);   //error prints to screen
      }

      Todo.find({text: text}).then((todos) => {    //testing what got saved in database
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => {
        done(e);
      });
    });
    });

    it('should not create todo with invalid body data', (done) => {
      request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => {
          done(e);
        });
      });
    });

});


describe('GET /todos', () => {

it('should get all todos', (done) => {
  request(app)
  .get('/todos')
  .expect(200)
  .expect((res) => {
    expect(res.body.todos.length).toBe(2);
  })
  .end(done);   //no need to provide a function like before, not doing anything asynchrously
});

});


describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  })

  it('should return a 404 if todo not found', (done) => {
    var hexIdNotInCollection = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexIdNotInCollection}`)
    .expect(404)
    .end(done);
  });

  it('should return a 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123')   //should fail if we try to convert 123 to an objectID
    .expect(404)
    .end(done)
  });

});



describe('DELETE /todos/:id', () => {

  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();  //picked second to do item for no specific reason
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId)
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      //query database using findById, expect toNotExist assertion
      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeFalsy();
        done()
      }).catch((e) => {
        done(e);
      });
    });

  });

  it('should return a 404 if todo not found', (done) => {
    var hexIdNotInCollection = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexIdNotInCollection}`)
    .expect(404)
    .end(done);
  });

  it('should return a 404 if invalid object id', (done) => {
    request(app)
    .get('/todos/123')   //should fail if we try to convert 123 to an objectID
    .expect(404)
    .end(done)
  });

});


describe('PATCH /todos/:url', () => {

  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = "text changed from text";
    var completed = true
    request(app)
    .patch(`/todos/${hexId}`)
    .send({text: text, completed: completed})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBeTruthy();
      expect(res.body.todo.completedAt).toBeTruthy();
    })
    .end(done)
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = "text changed again";
    var completed = false
    request(app)
    .patch(`/todos/${hexId}`)
    .send({text: text, completed: completed})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBeFalsy();
      expect(res.body.todo.completedAt).toBe(null);
    })
    .end(done)
  });


});
