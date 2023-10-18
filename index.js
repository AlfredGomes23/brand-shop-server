const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

//mongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');

//dotenv
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());




//routes
app.get('/', (req, resp) => {
    resp.send("Server is Running. Welcome to my Brand-Shop.");
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.by2eb1n.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        //create brands database collection
        const brandShopCollections = client.db('brand-shop').collection('brands');

        //brands routes
        app.get('/brands', async (req, resp) => {
            const result = await brandShopCollections.find().toArray();
            resp.send(result);
        });


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


//server terminal
app.listen(port, (req, resp) => {
    console.log("Brand-Shop server in running on port:", port);
})