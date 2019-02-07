const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err)
        return console.log('Unable to connect to MongoDB', err);
    console.log('Connected to MongoDB');
                                            //MongoDB update operators 
    var db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id : new ObjectID('5c5abffec9ad032585d67ca0')
    // }, {
    //     $set: {   //$set is a MongoDB operator. to find more operators : https://docs.mongodb.com/manual/reference/operator/update/
    //         complete: false
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((res) => console.log(res));


    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c5a8c077c93e71160881abd')
    }, {
        // $inc : {
        //     age: 1
        // },
        // $set : {
        //     Location : 'Mawanella'
        // },
        $set : {
            gender : 'Male'
        }
    }, {
        returnOriginal: false
    }).then((res) => console.log(res));


    client.close();
});