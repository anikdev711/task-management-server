const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0hycffb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        const userCollection = client.db("taskManagementDB").collection("users");
        const taskCollection = client.db("taskManagementDB").collection("tasks");
        const ongoingTaskCollection = client.db("taskManagementDB").collection("ongoingtasks");
        const completeTaskCollection = client.db("taskManagementDB").collection("completetasks");


        //tasks related

        app.get('/tasks', async (req, res) => {
            const cursor = taskCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            }
            const options = {
                upsert: true
            }
            const editedTask = req.body;
            const task = {
                $set: {
                    email: editedTask.email,
                    deadlines: editedTask.deadlines,
                    description: editedTask.description,
                    priority: editedTask.priority,
                    title: editedTask.title
                }
            }
            const result = await taskCollection.updateOne(filter, task, options);
            res.send(result);
        })

        //ongoing tasks

        // app.put('/ongoingtasks/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = {
        //         _id: new ObjectId(id)
        //     }
        //     const options = {
        //         upsert: true
        //     }
        //     const editedTask = req.body;
        //     const task = {
        //         $set: {
        //             email: editedTask.email,
        //             deadlines: editedTask.deadlines,
        //             description: editedTask.description,
        //             priority: editedTask.priority,
        //             title: editedTask.title
        //         }
        //     }
        //     const result = await ongoingTaskCollection.updateOne(filter, task, options);
        //     res.send(result);
        // })

        //ongoing

        app.get('/ongoingtasks', async (req, res) => {
            const cursor = ongoingTaskCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/ongoingtasks', async (req, res) => {
            const task = req.body;
            const result = await ongoingTaskCollection.insertOne(task);
            res.send(result);
        })

        //completed task

        app.get('/completetasks', async (req, res) => {
            const cursor = completeTaskCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })



        app.post('/completetasks', async (req, res) => {
            const task = req.body;
            const result = await completeTaskCollection.insertOne(task);
            res.send(result);
        })






        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await taskCollection.deleteOne(query);
            res.send(result)

        })


        //user related

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = {
                email: user.email
            }
            const isUserExist = await userCollection.findOne(query);
            if (isUserExist) {
                return res.send({ message: 'user exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Task management server running')
})

app.listen(port, () => {
    console.log(`Task management server is listening on port ${port}`)
})