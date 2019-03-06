require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//------------TODO ROUTS ---------------
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

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send({message: 'Invalid ID'});
    
    Todo.findById(id).then((doc) => {
        if(!doc)
            return res.status(404).send({message: 'Data not found'});
        res.send({doc});
    }, (err) => {
        res.status(400).send({message: 'invalid parameter'});
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send({message: 'Invalid ID'});
    
    Todo.findByIdAndDelete(id).then((result) => {
        if(!result)
            return res.status(404).send({message: 'Data not found'});
        res.send({
            message: "Data deleted.",
            result});
    }, (err) => {
        res.status(404).send({message: 'Invalid parameter'});
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    // var body = {
    //     text: req.body.text,
    //     completed: req.body.completed            // in this method if the text is not recieved from the user. it will set to null that is why we used the method below(_.pick)
    // };

    var body = _.pick(req.body, ['text', 'completed']);  //using this _.pick method to get value if it is there in the body. if not the varialbe will not be set in the body.
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send({message: 'Invalid ID'});
    }
    if(body.completed === undefined && body.text === undefined){
        return res.status(404).send({message: 'No data recieved'});
    }

    if(typeof body.completed === 'boolean' && body.completed){
        body.completedAt = new Date().getTime();
    }
    else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((result) => {
        if(!result){
            return res.status(404).send({message: 'Data not found'});
        }
        res.send({
            message: "Updated successfully",
            result
        });
    }).catch((e) => res.status(400).send({message:"invalid parameter"}));

});

//-------------USER ROUTS ---------------

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var newUser = new User(body);

    newUser.save().then(() => {
        return newUser.generateAuthToken();
        //res.send({message: 'Data saved', doc});
    }).then((token) => {
        res.header('x-auth', token).send(newUser);
    }).catch((err) => {
        res.status(400).send({message:`Unable to save the data`, err})
    });
});


app.get('/users/me', authenticate, (req, res) => {
        res.send(req.user);
});

app.listen(port, ()=> console.log(`Server is running on port ${port}`));

module.exports = {app};