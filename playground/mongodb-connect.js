// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var objid = new ObjectID();  //To create new id usibg ObjectID method
// console.log(objid);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err)
    {
        return console.log('Unable to connect to the server.');
    }
    console.log('Successfully connected to the server.')
    
    // const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     time: '20:02:50',
    //     color: 'red'
    // }, (err, res) =>{
    //     if(err)
    //         return console.log('Unable to insert the data: ',err);
    //     console.log(res.ops[0]._id.getTimestamp());
    // });

    // const db = client.db('TodoApp');
    // db.collection('Users').insertOne({
    //     userName: 'Titan',
    //     age: 34,
    //     Location: 'Colombo'
    // }, (err, res)=>{
    //     if(err)
    //         return console.log("Unable to insert data: ",err);
    //     console.log(res.ops);
    // });



    client.close();
});