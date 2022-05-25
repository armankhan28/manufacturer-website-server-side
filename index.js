const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { query } = require('express');

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4jj7.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 async function run(){
    try{
      await client.connect();
      const serviceCollection = client.db('khan_tools').collection('services');
      const bookingCollection = client.db('khan_tools').collection('booking');
      const userCollection = client.db('khan_tools').collection('users');

      app.get('/service', async(req, res) =>{
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
      });

      app.put('/user/:email', async (req, res) => {
        const email = req.params.email;
        const user = req.body;
        const filter = { email: email };
        const options = { upsert: true };
        const updateDoc = {
          $set: user,
        };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      });

      app.get('/booking', async(req, res)=>{
        const client = req.query.client;
        const query = {client: client};
        const bookings = await bookingCollection.find(query).toArray();
        res.send(bookings);
      })

      app.post('/booking', async(req, res)=>{
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
      })
    }
    finally{

    }
 }

 run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Khan Tools')
})

app.listen(port, () => {
  console.log(`KHANTOOLS app listening on port ${port}`)
})