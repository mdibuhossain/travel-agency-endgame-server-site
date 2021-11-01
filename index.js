const express = require('express');
const { MongoClient } = require('mongodb');

const cors = require('cors');
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

        app.get('/', (req, res)=>{
            res.send('Running WorldTrip server');
        })


        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        
        app.get('/blog', async (req, res) => {
            const cursor = blogPostCollection.find({});
            const blog = await cursor.toArray();
            res.send(blog);
        })


        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
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