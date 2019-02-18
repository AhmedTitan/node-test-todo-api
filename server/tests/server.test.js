var env = process.env.NODE_ENV;

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [{
    _id: '5c691dca1eaad02b182e5f8d',
    text: 'first test todo'
},{
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos ', () => {
    it('should create a new todo', (done) => {
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
            //.expect((res) => expect(res.text).toBe('Unable to save the data.'))
            .end((err, res) => {
                if(err)
                    return done(err);
                
                Todo.find().then((todos) => {
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