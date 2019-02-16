const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5c624ef498b636278cd28b2a11';
// if(!ObjectID.isValid(id))
//     return console.log('Invald ID.');

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos: ', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo: ',todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo)
//         return console.log('Id not found');
//     console.log('Todo by id:', todo);
// }).catch((e) => console.log(e.message));

User.findById(id).then((doc) => {
    if(!doc)
        return console.log('Data not found.');
    console.log(doc);
}, (err) => {
    console.log('invalid input.',err.message);
});


//To discover more queries visit this page
// https://mongoosejs.com/docs/queries.html