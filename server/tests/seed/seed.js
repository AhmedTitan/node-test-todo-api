const {ObjectID} = require("mongodb");
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
var users = [{
    _id: userOneId,
    email: 'qwerty@uio.com',
    password: 'qwertypass', 
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]   
}, {
    _id: userTwoId,
    email: 'zxcvb@nml.com',
    password: 'zxcvbnpass'
}];

var todos = [{
    _id: '5c691dca1eaad02b182e5f8d',
    text: 'first test todo'
},{
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333
}];

var populateTodos = function (done) {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done()); //.end(done());
};



var populateUser = (done) => {
    User.deleteMany({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(done());
};

module.exports = {todos, populateTodos, users, populateUser};