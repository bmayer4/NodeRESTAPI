const expect = require('expect');
const request = require('supertest');

//var app = require('./server.js').app;   ES6 destructuring below, same
var {app} = require('./../server.js')   //     ./ is relative path, then back one directory
const {Todo} = require('./../models/todo.js');

//testing lifecycle method, runs code before every test case
//here, make sure database is empty
beforeEach((done) => {
  Todo.remove({}).then(() => {
    done();
  });
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
    .end((err, res) => {
      if (err) {
        return done(err);   //error prints to screen
      }

      Todo.find().then((todos) => {    //testing what got saved in database
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => {
          done(e);
        });
      });
    });



});
