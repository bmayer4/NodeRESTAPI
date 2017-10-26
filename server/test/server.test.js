const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
//https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/questions/2614939

//var app = require('./server.js').app;   ES6 destructuring below, same
var {app} = require('./../server.js')   //     ./ is relative path, then back one directory
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

//testing lifecycle method, runs code before every test case
//here, make sure database is empty
beforeEach(populateUsers);
beforeEach(populateTodos);

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
    var text = "text changed from test";
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



describe('GET /users/me', () => {

  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)  //.set sets header
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

});



describe('POST /users', () => {

  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'example123';
    request(app)
    .post('/users')
    .send({email: email, password: password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();  //can't use dot notation since header name has hyphen
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findOne({email: email}).then((user) => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);  //it gets hashed
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'example.comnoemail';
    var password = 'exa';
    request(app)
    .post('/users')
    .send({email: email, password: password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
    .post('/users')
    .send({email: users[0].password, password: 'password123'})
    .expect(400)
    .end(done);
  });

});



describe('POST /users/login', () => {

  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: users[1].password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
    }).end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0].access).toContain('auth');
        expect(user.tokens[0].token).toContain(res.headers['x-auth']);
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: 'blah123'})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        console.log(user);  //has token empty since part of model
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => {
      done(e);
    });
  });

});

});


describe('DELETE /users/me/token', () => {

it('should remove auth token on logout', (done) => {
  request(app)
  .delete('/users/me/token')
  .set('x-auth', users[0].tokens[0].token)
  .expect(200)
  .end((err, res) => {
    if (err) {
      return done(err);
    }
    User.findById(users[0]._id).then((user) => {
      expect(user.tokens.length).toBe(0);
      done();
    }).catch((e) => {
      done(e);
    });
  });
});

});
