const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

//Middleware 
app.use(cors());
app.use(express.json());





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbfgu.mongodb.net/?retryWrites=true&w=majority`;

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

    const toysCollection =  client.db('kidsDB').collection('toys')

    app.get('/toys', async(req, res) => {
      const result = await toysCollection.find().limit(6).toArray()
      res.send(result);
    })
    app.get('/allToys', async(req, res) => {
      const result = await toysCollection.find().limit(20).toArray()
      res.send(result);
    })

    app.get('/toys/engineering', async(req, res) => {
     const category = req.params.category;
     const result = await toysCollection.find({ category: 'Engineering' }).limit(3).toArray();
     res.send(result);
    })
    app.get('/toys/language', async(req, res) => {
     const category = req.params.category;
     const result = await toysCollection.find({ category: 'Language' }).limit(3).toArray();
     res.send(result);
    })
    app.get('/toys/math', async(req, res) => {
     const category = req.params.category;
     const result = await toysCollection.find({ category: 'Math' }).limit(3).toArray();
     res.send(result);
    })

    //post 
    app.post('/addToy', async(req, res) => {
      const body = req.body;
      const result = await toysCollection.insertOne(body);
      console.log(result);
      res.send(result);
    })

    // my toys api

    app.get('/myToys/:email', async (req, res) => {
      console.log(req.params.email)
      const result = await toysCollection.find({
        sellerEmail: req.params.email}).toArray();
      res.send(result);
    })

    //update 
    app.patch('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
       const updatedToys = req.body;
       const options = { upsert: true };
       const updateDoc = {
        $set: {
          status : updatedToys.status
        },
      };
      const result = await toysCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    //delete my toys
    app.delete('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.deleteOne(query)
      res.send(result);
    })

    //search toys api
  //   const indexKeys = {name:1, category:1}
  //  const indexOptions = {name: 'nameCategory'}
  //  const result = await toysCollection.createIndex(indexKeys, indexOptions);

    // app.get("/getToysByName/:text", async (req, res) => {
    //   const searchText = req.params.text;
    //   const result = await toysCollection
    //     .find({
    //       $or: [
    //         { title: { $regex: searchText, $options: "i" } },
    //         { category: { $regex: searchText, $options: "i" } },
    //       ],
    //     })
    //     .toArray();
    //   res.send(result);
    // });


    
    
   
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
  res.send('Welcome to sever world!');
})

app.listen(port, () => {
  console.log(`listening on port ${port}` )
})