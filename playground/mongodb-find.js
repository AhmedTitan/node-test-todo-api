// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err)
    {
        return console.log('Unable to connect to the server.');
    }
    console.log('Successfully connected to the server.')
    
    const db = client.db('TodoApp');
    
    // db.collection('Todos').find({_id: new ObjectID('5c5a785df0fb050b7c4937f1')}).toArray().then((docs) => {
    //     console.log('Todos:');
    //     console.log(docs);
    // }, (err) =>{
    //     console.log('Unable to find the data', err);
    // });

    db.collection('Users').count({userName: 'Ahmed Razick'}).then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) =>{
        console.log('Unable to find any data: ', err);
    });

    client.close();
});