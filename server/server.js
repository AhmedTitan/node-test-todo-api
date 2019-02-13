const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.post('/todos',(req, res) =>{
    var newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then((doc) => {
        res.send({
            message: 'Data saved.',
            doc: doc
        });
    }, (err) => {
        res.status(400).send('Unable to save the data.')
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            number_of_todos: todos.length,
            todos
        })
    }, (err) => {
        res.status(400).send(err);
    });
});


app.listen(3000, ()=> console.log('Server is running on port 3000'));

module.exports = {app};