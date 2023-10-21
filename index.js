const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

//mongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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




        //_______________ Brands _____________
        //brands collection
        const brandsCollections = client.db('brand-shop').collection('brands');
        //brands routes
        //get all brands
        app.get('/brands', async (req, resp) => {
            const result = await brandsCollections.find().toArray();
            resp.send(result);
        });




        //__________________ Products ________________
        //products collection
        const productsCollections = client.db('brand-shop').collection('products');
        //get all products
        app.get('/products', async (req, resp) => {
            const result = await productsCollections.find().toArray();
            resp.send(result);
        });
        //get a product
        app.get('/products/:id', async (req, resp) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollections.findOne(query);
            resp.send(result);
        })
        //add a product
        app.post('/products', async (req, resp) => {
            const product = req.body;
            console.log(product);
            const result = await productsCollections.insertOne(product);
            resp.send(result);
        })
        //update a product
        app.put('/products/:id', async (req, resp) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: false };
            const updatedProduct = req.body;
            const newProduct = {
                $set: {
                    img: updatedProduct.url,
                    name: updatedProduct.name,
                    brand_name: updatedProduct.brand,
                    product_type:updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating                    
                }
            }
            const result = await productsCollections.updateOne(filter, newProduct, option);
            resp.send(result);
        });
        //delete a product



        //___________________ Cart ________________
        //cart collection
        const cart = client.db('brand-shop').collection('cart');
        //get all cart item
        app.get('/cart', async (req, resp) => {
            const result = await cart.find().toArray();
            resp.send(result);
        });
        //get a cart item
        app.get('/cart/:id', async (req, resp) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cart.findOne(query);
            resp.send(result);
        });
        //add  to cart
        app.post('/cart', async (req, resp) => {
            const product = req.body;
            const result = await cart.insertOne(product);
            resp.send(result);
        });
        //delete from cart
        app.delete('/cart/:id', async (req, resp) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cart.deleteOne(query);
            resp.send(result);
        })


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