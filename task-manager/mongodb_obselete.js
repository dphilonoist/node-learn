const { MongoClient, ObjectId } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager'

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('unable to connect');
    }
    const db = client.db(dbName)

    // db.collection('users').insertOne({
    //     user: 'Dushyant',
    //     age: 30
    // }, (error, result) => {
    //     if (error) {
    //         return 'unable to insert user'
    //     }
    //     console.log(result)
    // })

    db.collection('users').insertMany([{
        // _id: new ObjectId(),
        user: 'Dushyant',
        age: 30
    },{
        // _id: new ObjectId(),
        user: 'Shiv',
        age: 31
    }], (error, result) => {
        if (error) {
            return 'unable to insert user'
        }
        console.log(result)
    })
})