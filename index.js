const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri =`mongodb://${process.env.USER_DB}:${process.env.USER_PASS}@ac-ryc1yaw-shard-00-00.24tdr3m.mongodb.net:27017,ac-ryc1yaw-shard-00-01.24tdr3m.mongodb.net:27017,ac-ryc1yaw-shard-00-02.24tdr3m.mongodb.net:27017/?ssl=true&replicaSet=atlas-8jb3tk-shard-0&authSource=admin&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("smart deal server is running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart-deal-db");
    const productsCollection = db.collection("products");
    const bidsCollection = db.collection("bids");

    // products apis
    // get
    app.get("/products", async (req, res) => {
      const projectFields = {
        _id: 0,
        title: 1,
        price_min: 1,
        price_max: 1,
        email: 1,
        image: 1,
        sale_status: 1,
      };

      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      // const cursor=productsCollection.find(query).sort({price_min: -1}).skip(2).limit(5).project(projectFields);
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.get('/latestproducts', async(req, res)=>{
      const cursor=productsCollection.find().sort({created_at:-1}).limit(9);
      const result=await cursor.toArray();
      res.send(result);
    })

    // post
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // patch
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedProduct = req.body;
      const update = {
        $set: {
          name: updatedProduct.name,
          age: updatedProduct.age,
        },
      };
      const options = {};
      const result = await productsCollection.updateOne(query, update, options);
      res.send(result);
    });

    // bids apiiiisssssss

    // get
 app.get("/bids", async (req, res)=>{
      const email=req.query.email;
      const query={};
      if(email){
        query.buyer_email=email;
      }
      const cursor=bidsCollection.find(query).sort({bid_price: -1});
      const result= await cursor.toArray();
      res.send(result);
    })

    // get(productId)
    app.get("/products/bids/:productId", async (req, res)=>{
      const productId=req.params.productId;
      const query={product: productId};
      const cursor=bidsCollection.find(query).sort({bid_price: -1})
      const result=await cursor.toArray();
      res.send(result);
    })
    // post
    app.post("/bids", async (req, res) => {
      const newBid = req.body;
      const result = await bidsCollection.insertOne(newBid);
      res.send(result);
    });

    // delete
app.delete("/bids/:id", async (req, res)=>{

      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result= await bidsCollection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`smart deal server port ${port}`);
});
