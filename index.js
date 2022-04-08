const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

//middle wire
app.use(cors());
app.use(express.json());

//add User pass from dotenv

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hiysg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//check on cmd 
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Run named Function for server to db
async function run() {
    try {

        //making db and Collection on database
        await client.connect();
        const database = client.db('Travel');
        const ProductsCollection = database.collection('Products');
        const BookingsCollection = database.collection('Bookings');
        const usersCollection = database.collection('User');
        const reviewsCollection = database.collection('Review');
        //Getting All Product
        app.get('/products', async (req, res) => {
            const cursor = ProductsCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })
        //Getting Specific Product that user clicked
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await ProductsCollection.findOne(query);
            res.json(package)
        })
        //Getting All User
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })
        //chacking User ADmin or Not
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // get order by email
        app.get('/bookingInfo/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const cursor = BookingsCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments)
        })

        app.get('/bookingInfo', async (req, res) => {
            const cursor = BookingsCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })



        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await ProductsCollection.insertOne(product);
            res.json(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        app.post('/reviews', async (req, res) => {
            const user = req.body;
            const result = await reviewsCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        })
        app.post('/bookingInfo', async (req, res) => {
            const bookingInfo = req.body;
            console.log(bookingInfo);
            const result = await BookingsCollection.insertOne(bookingInfo);
            res.json(result)
        })
        //Delete Data
        app.delete("/bookingInfo/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            // const deleteOrder = await BookingsCollection.deleteOne(query);
            res.json(query);
        });


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


//checking first time
app.get('/', (req, res) => {
    res.send('Hello  travelers !');
});

app.listen(port, () => {
    console.log('listening at', port);
});