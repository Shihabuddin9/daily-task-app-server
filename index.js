const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmulx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("dailyTask").collection('userTask')
        const completedTaskCollection = client.db("dailyTask").collection('completedTask')

        // create new task
        app.post('/task', async (req, res) => {
            const newTask = req.body
            const result = await taskCollection.insertOne(newTask);
            res.send(result)
        })

        // task get for ui show
        app.get('/allTask', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        // task delete from ui
        app.delete('/allTask/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })

        // task get for update to page show
        app.get('/allTask/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result)
        })

        // task update
        app.put('/allTask/:id', async (req, res) => {
            const id = req.params.id
            const updateTask = req.body
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    newTask: updateTask.newTask
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        // task post for completed
        app.post('/completed', async (req, res) => {
            const completed = req.body
            const result = await completedTaskCollection.insertOne(completed);
            res.send(result)
        })

        // task get for completed
        app.get('/completed', async (req, res) => {
            const query = {};
            const cursor = completedTaskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        // completed delete from ui
        app.delete('/completed/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await completedTaskCollection.deleteOne(query);
            res.send(result)
        })


    } finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})