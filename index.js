const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// midware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5p7yt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('WorldTrip');
        const serviceCollection = database.collection('service');
        const blogPostCollection = database.collection('blogPost');
        const orderCollection = database.collection('order');

        app.get('/', (req, res) => {
            res.send('Running WorldTrip server');
        })

        // Get Services
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get order
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        });

        // Delete order
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const finalRes = await orderCollection.deleteOne(query);
            console.log('delete successfull', finalRes);
            res.json(finalRes);
        })

        // Delete Service
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const finalRes = await serviceCollection.deleteOne(query);
            console.log('delete successfull', finalRes);
            res.json(finalRes);
        })

        // Update service
        app.put('/services/updateservice/:id', async (req, res) => {
            const id = req.params.id;
            const updateRes = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const finalUpdate = {
                $set: {
                    name: updateRes.name,
                    email: updateRes.email,
                    title: updateRes.title,
                    price: updateRes.price,
                    rate: updateRes.rate,
                    description: updateRes.description,
                    img: updateRes.img
                }
            };
            const result = await serviceCollection.updateOne(filter, finalUpdate, options);
            // console.log('updating', id);
            res.json(result);
        })

        // Get Blogs
        app.get('/blog', async (req, res) => {
            const cursor = blogPostCollection.find({});
            const blog = await cursor.toArray();
            res.send(blog);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);
            const result = await serviceCollection.insertOne(service);
            // console.log(result);
            res.json(result);
        })

        // Post order 
        app.post('/order', async (req, res) => {
            const order = req.body;
            // console.log('hit the order api', order);
            const result = await orderCollection.insertOne(order);
            // console.log(result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

 
app.listen(port, () => {
    console.log('listening PORT', port);
})