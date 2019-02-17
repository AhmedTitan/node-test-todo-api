const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [{
    _id: '5c691dca1eaad02b182e5f8d',
    text: 'first test todo'
},{
    text: 'second test todo'
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