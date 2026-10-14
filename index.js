// const express = require("express");
// const cors = require("cors");
// require('dotenv').config();
// // const jwt = require('jsonwebtoken');
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const app = express();
// const admin = require("firebase-admin");
// const { cert } = require("firebase-admin/app");
// const port = process.env.PORT || 3000;


// // const serviceAccount = require("./smart-deal-app-firebase-adminsdk-fbsvc-521405b3b6.json");
// admin.initializeApp({
//   credential: cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   })
// });


// // middleware
// app.use(cors());
// app.use(express.json());

// const verifyFireBaseToken= async(req, res, next)=>{
 
//   if(!req.headers.authorization){
//     return res.status(401).send({message : "unauthorized access"});
//   }
//   const token=req.headers.authorization.split(" ")[1];
//   if(!token){
//    return res.status(401).send({message : "unauthorized access"});
//   }

//   try{
//    const userInfo=await admin.auth().verifyIdToken(token);
//    req.token_email=userInfo.email;

//    next();
//   }
//   catch{
//    return res.status(401).send({message : "unauthorized access"});
//   }
  
 
// }

// // const verifyJWTToken=(req, res, next)=>{
// //   const authorization=req.headers.authorization;
// //   if(!authorization){
// //     return res.status(401).send({message :"unauthorized email"});
// //   }
// //   const token=req.headers.authorization.split(" ")[1];
// //   if(!token){
// //     return res.status(401).send({message :"unauthorized access"})
// //   };

// //   jwt.verify(token, process.env.JWT_SECRET,(err, decoded)=>{
// //     if(err){
// //       return res.status(401).send({message : "unauthorized access"});
// //     }
// //  next();
// //   })
   
// // }

// const uri =`mongodb://${process.env.USER_DB}:${process.env.USER_PASS}@ac-ryc1yaw-shard-00-00.24tdr3m.mongodb.net:27017,ac-ryc1yaw-shard-00-01.24tdr3m.mongodb.net:27017,ac-ryc1yaw-shard-00-02.24tdr3m.mongodb.net:27017/?ssl=true&replicaSet=atlas-8jb3tk-shard-0&authSource=admin&appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });


// //
// app.get("/", (req, res) => {
//   res.send("smart deal server is running");
// });

// async function run() {
//   try {
//     await client.connect();

//     const db = client.db("smart-deal-db");
//     const productsCollection = db.collection("products");
//     const bidsCollection = db.collection("bids");


//     // // jwt apisssssssssssssss
//     // app.post("/getToken", (req, res)=>{
//     //   const loggedUser=req.body;
//     //   const token=jwt.sign(
//     //     loggedUser, 
//     //       process.env.JWT_SECRET,
//     //        { expiresIn: '1h' });
//     //        res.send({token : token})
//     // })

//     // products apisssssssssssssss
//     // get
//     app.get("/products", async (req, res) => {
//       const projectFields = {
//         _id: 0,
//         title: 1,
//         price_min: 1,
//         price_max: 1,
//         email: 1,
//         image: 1,
//         sale_status: 1,
//       };

//       const email = req.query.email;
//       const query = {};
//       if (email) {
//         query.email = email;
//       }
//       // const cursor=productsCollection.find(query).sort({price_min: -1}).skip(2).limit(5).project(projectFields);
//       const cursor = productsCollection.find(query);
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.get("/products/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await productsCollection.findOne(query);
//       res.send(result);
//     });

//     app.get('/latestproducts', async(req, res)=>{
//       const cursor=productsCollection.find().sort({created_at:-1}).limit(9);
//       const result=await cursor.toArray();
//       res.send(result);
//     })

//     // post
//     app.post("/products", async (req, res) => {
//       const newProduct = req.body;
//       newProduct.created_at = new Date();
//       const result = await productsCollection.insertOne(newProduct);
//       res.send(result);
//     });

//     // delete
//     app.delete("/products/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await productsCollection.deleteOne(query);
//       res.send(result);
//     });

//     // patch
//     app.patch("/products/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const updatedProduct = req.body;
//       const update = {
//         $set: updatedProduct
        
//       };
//       const options = {};
//       const result = await productsCollection.updateOne(query, update, options);
//       res.send(result);
//     });

//     // bids apiiiisssssss

//     // get
//  app.get("/bids", verifyFireBaseToken, async (req, res)=>{
//   console.log(req.headers);
//       const email=req.query.email;
//       const query={};
//       if(email){
//         if(email !== req.token_email){
//           return res.status(403).send({message :"forbidden access"});
//         }
//         query.buyer_email=email;
//       }
//       const cursor=bidsCollection.find(query).sort({bid_price: -1});
//       const result= await cursor.toArray();
//       res.send(result);
//     })

// // generate token by myself(get)
// // app.get("/bids", verifyJWTToken, async (req, res)=>{
// //   const email=req.query.email;
// //   const query={};
// //   if(email){
// //     query.buyer_email=email;
// //   }
// //   const cursor=bidsCollection.find(query).sort({bid_price: -1});
// //   const result=await cursor.toArray();
// //   res.send(result);
// // })

//     // get(productId)
//     app.get("/products/bids/:productId", async (req, res)=>{
//       const productId=req.params.productId;
//       const query={product: productId};
//       const cursor=bidsCollection.find(query).sort({bid_price: -1})
//       const result=await cursor.toArray();
//       res.send(result);
//     })
//     // post
//     app.post("/bids", async (req, res) => {
//       const newBid = req.body;
//       const result = await bidsCollection.insertOne(newBid);
//       res.send(result);
//     });

//     // delete
// app.delete("/bids/:id", async (req, res)=>{

//       const id=req.params.id;
//       const query={_id: new ObjectId(id)};
//       const result= await bidsCollection.deleteOne(query);
//       res.send(result);
//     })

//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!",
//     );
//   } finally {
//   }
// }
// run().catch(console.dir);

// app.listen(port, () => {
//   console.log(`smart deal server port ${port}`);
// });
















const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
const { cert } = require("firebase-admin/app");

const app = express();
const port = process.env.PORT || 3000;

admin.initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

app.use(cors());
app.use(express.json());

const verifyFireBaseToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  try {
    const userInfo = await admin.auth().verifyIdToken(token);
    req.token_email = userInfo.email;
    next();
  } catch {
    return res.status(401).send({ message: "unauthorized access" });
  }
};

const uri = `mongodb://${process.env.USER_DB}:${process.env.USER_PASS}@ac-ryc1yaw-shard-00-00.24tdr3m.mongodb.net:27017,ac-ryc1yaw-shard-00-01.24tdr3m.mongodb.net:27017,ac-ryc1yaw-shard-00-02.24tdr3m.mongodb.net:27017/?ssl=true&replicaSet=atlas-8jb3tk-shard-0&authSource=admin&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// connect once, reuse across invocations
let dbPromise;
function getDb() {
  if (!dbPromise) {
    dbPromise = client.connect().then(() => client.db("smart-deal-db"));
  }
  return dbPromise;
}

app.get("/", (req, res) => {
  res.send("smart deal server is running");
});

// ---------- products ----------
app.get("/products", async (req, res) => {
  const db = await getDb();
  const query = {};
  if (req.query.email) query.email = req.query.email;
  const result = await db.collection("products").find(query).toArray();
  res.send(result);
});

app.get("/products/:id", async (req, res) => {
  const db = await getDb();
  const result = await db
    .collection("products")
    .findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

app.get("/latestproducts", async (req, res) => {
  const db = await getDb();
  const result = await db
    .collection("products")
    .find()
    .sort({ created_at: -1 })
    .limit(9)
    .toArray();
  res.send(result);
});

app.post("/products", async (req, res) => {
  const db = await getDb();
  const newProduct = req.body;
  newProduct.created_at = new Date();
  const result = await db.collection("products").insertOne(newProduct);
  res.send(result);
});

app.delete("/products/:id", async (req, res) => {
  const db = await getDb();
  const result = await db
    .collection("products")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

app.patch("/products/:id", async (req, res) => {
  const db = await getDb();
  const result = await db
    .collection("products")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
  res.send(result);
});

// ---------- bids ----------
app.get("/bids", verifyFireBaseToken, async (req, res) => {
  const db = await getDb();
  const email = req.query.email;
  const query = {};
  if (email) {
    if (email !== req.token_email) {
      return res.status(403).send({ message: "forbidden access" });
    }
    query.buyer_email = email;
  }
  const result = await db
    .collection("bids")
    .find(query)
    .sort({ bid_price: -1 })
    .toArray();
  res.send(result);
});

app.get("/products/bids/:productId", async (req, res) => {
  const db = await getDb();
  const result = await db
    .collection("bids")
    .find({ product: req.params.productId })
    .sort({ bid_price: -1 })
    .toArray();
  res.send(result);
});

app.post("/bids", async (req, res) => {
  const db = await getDb();
  const result = await db.collection("bids").insertOne(req.body);
  res.send(result);
});

app.delete("/bids/:id", async (req, res) => {
  const db = await getDb();
  const result = await db
    .collection("bids")
    .deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
});

// local dev only
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`smart deal server port ${port}`));
}

module.exports = app;