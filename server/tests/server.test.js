var env = process.env.NODE_ENV;

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUser} = require('./seed/seed');

beforeEach(populateUser);
beforeEach(populateTodos);


describe('POST /todos ', function () {
    it('should create a new todo', function (done) {
        this.timeout(10000);
        var text = 'new test todo';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.text).toBe(text);
            })
            .end((err, res)=>{
                if (err)
                    return done(err);
                
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Should not crete todo with invalid body', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .expect((res) => expect(res.text).toBe('Unable to save the data.'))
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.find({}).then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});


describe('GET /todos', () => {
    it('should return all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => expect(res.body.todos.length).toBe(2))
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return 404 error for invalid id', (done) => {
        request(app)
            .get('/todos/5c67ab5cba0f46081830c5e611')
            .expect(404)
            .expect((res) => expect(res.body.message).toBe('Invalid ID'))
            .end(done);
    });
    it('should return 404 error for no data found', (done) => {
        request(app)
            .get('/todos/5c67ab5cba0f46081830c5a9')
            .expect(404)
            .expect((res) => expect(res.body.message).toBe('Data not found'))
            .end(done);
    });
    it('should return the data', (done) => {
        request(app)
            .get('/todos/5c691dca1eaad02b182e5f8d')
            .expect(200)
            .expect((res) => {
                expect(res.body.doc._id).toBe('5c691dca1eaad02b182e5f8d');
                expect(res.body.doc.text).toBe('first test todo');
            })
            .end(done);
    });
});

describe('DELETE /todos/id:', () =>{
    it('should delete the item', (done) => {
        request(app)
            .delete(`/todos/5c691dca1eaad02b182e5f8d`)
            .expect(200)
            .expect((doc) => {
                expect(doc.body.message).toBe("Data deleted.");
                expect(doc.body.result._id).toBe('5c691dca1eaad02b182e5f8d');
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.findById('5c691dca1eaad02b182e5f8d').then((doc) => {
                    expect(doc).toBeFalsy();
                    done();
                }).catch((err) => done(err));
            });
    });
    it('should return 404 error for invalid id', (done) => {
        request(app)
            .delete(`/todos/asd123`)
            .expect(404)
            .expect((doc) => expect(doc.body.message).toBe('Invalid ID'))
            .end(done);
    });
    it('should return 404 error for id not found', (done) => {
        request(app)
            .delete(`/todos/6c691dca1eaad02b182e5f8d`)
            .expect(404)
            .expect((doc) => expect(doc.body.message).toBe('Data not found'))
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo clear completedAt when its not completed', (done) => {
        var body = {completed: false, text:"Updated 2nd text"}
        request(app)
            .patch(`/todos/${todos[1]._id}`)
            .send(body)
            .expect(200)
            .expect((doc) => {
                expect(doc.body.message).toBe('Updated successfully');
                expect(doc.body.result.completed).toBe(false);
                expect(doc.body.result.completed).not.toBe(333);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(todos[1]._id).then((doc) => {
                    expect(doc.completed).toBe(false);
                    expect(doc.completed).not.toBe(333);
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should update the todo and set completedAt', (done) => {
        var body = {completed: true};
        request(app)
            .patch(`/todos/${todos[0]._id}`)
            .send(body)
            .expect(200)
            .expect((doc) => {
                expect(doc.body.message).toBe('Updated successfully');
                expect(doc.body.result.completed).toBe(true);
                expect(doc.body.result.completedAt).not.toBe(null);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.findById(todos[0]._id).then((res) => {
                    expect(res.completed).toBe(true);
                    expect(res.completedAt).not.toBe(null);
                    done();
                }, (err) => done(err));
            });
    });

    it('should return 404 for invalid id', (done) => {
        var body = {completed: true};
        request(app)
            .patch(`/todos/13212dfsdf`)
            .send(body)
            .expect(404)
            .expect((doc) => {
                expect(doc.body.message).toBe('Invalid ID');
            })
            .end(done)
    });

    it('should return 404 for no date found', (done) => {
        var body = {completed: true};
        request(app)
            .patch(`/todos/5c691dca1eaad02b182e5f9d`)
            .send(body)
            .expect(404)
            .expect((doc) => {
                expect(doc.body.message).toBe('Data not found');
            })
            .end(done)
    });
    it('should return 404 for send without body', (done) => {
        var body = {completed: true};
        request(app)
            .patch(`/todos/5c691dca1eaad02b182e5f8d`)
            .send()
            .expect(404)
            .expect((doc) => {
                expect(doc.body.message).toBe('No data recieved');
            })
            .end(done)
    });
});

describe('GET /usres/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated (without header)', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)         
    });
    it('should return 401 if not authenticated (with invalid header)', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzZkODRlNGU1OGFhZjE3NDgyOTFlYTciLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUwNjgxMzE2fQ.24ppIq-UqnKad88GZV-FgsEBwCRebw7QaAOAlUa2-HQ')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});   
            })  
            .end(done)    
    });
});

describe('POST /users', function () {
    it('should create a user', function (done) {
        var newUser = {
            email: "zebra@animal.com",
	        password: "animal1233"
        };
        request(app)
            .post(`/users`)
            .send(newUser)
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist;
                expect(res.body._id).toExist;
                expect(res.body.email).toBe(newUser.email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                User.findOne({'email': newUser.email}).then((user) => {
                    expect(user).toExist;
                    expect(user.password).not.toBe(newUser.password);
                    done();
                });
            });
    });
    it('should return validation error if request invalid', (done) => {
        var newUser = {
            email: "zebra@animal.com",
	        password: "ani"
        };
        request(app)
            .post('/users')
            .send(newUser)
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toBe('Unable to save the data');
            })
            .end(done);
    });
    it('should not ceate a user if email is in use', (done) => {
        var newUser = {
            email : users[0].email,
            password: '12345678'
        }
        request(app)
            .post('/users')
            .send(newUser)
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist;
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e)); 
            });
    });
    it('should reject invalid login', (done) => {
        var body = {
            email: 'abcdefghi@jkl.mno',
            password: '0987654321'
        };
        request(app)
            .post('/users/login')
            .send(body)
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy;
                expect(res.body.message).toBe('Invalid email address or password');
            })
            .end((e) => {
                if(e){
                    return done(e);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});
describe('DELETE /users/me/token', (done) => {
    it('should remove auth token remove', () => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe('loged out.');
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});