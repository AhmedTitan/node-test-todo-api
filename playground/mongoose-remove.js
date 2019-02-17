const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}).then((res) => {
//     console.log(res);
// });

Todo.findByIdAndRemove('5c69502313071f0764ab3573').then((res) => {
    console.log(res);
});