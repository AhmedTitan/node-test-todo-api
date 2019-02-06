// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err)
    {
        return console.log('Unable to connect to the server.');
    }
    console.log('Successfully connected to the server.')

    var db = client.db('TodoApp');
    
    //--Available delete methods
    //deleteMany()
    // db.collection('Todos').deleteMany({name: 'Evening walk'}).then((result) => {
    //     console.log(result)
    // });

    //deleteOne()
    // db.collection('Todos').deleteOne({name: 'Evening walk'}).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete()
    // db.collection('Todos').findOneAndDelete({name: 'Evening walk'}).then((result) => {
    //     console.log(result);
    // });



    // db.collection('Users').deleteMany({userName: 'Ahmed Razick'}).then((result) => console.log('Number of node(s) Deleted: ',result.result.n));

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5c5a8c7324d79f262cc82bf6')}).then((result) => console.log(result));

    client.close();
});