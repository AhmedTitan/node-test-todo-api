const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5c67ab5cba0f46081830c5e711';
if(!ObjectID.isValid(id))
    return console.log('Invald ID.');

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

Todo.findById(id).then((todo) => {
    if(!todo)
        return console.log('Id not found');
    console.log('Todo by id:', todo);
}).catch((e) => console.log(e.message));

//To discover more queries visit this page
// https://mongoosejs.com/docs/queries.html