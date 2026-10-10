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

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

const {
  initializeApp,
  getApps,
  cert,
} = require("firebase-admin/app");

const { getAuth } = require("firebase-admin/auth");

const app = express();
const port = process.env.PORT || 3000;

// --------------------
// Middleware
// --------------------

app.use(cors());
app.use(express.json());

// --------------------
// Firebase Admin Setup
// --------------------

if (getApps().length === 0) {
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    throw new Error(
      "Firebase Admin environment variables are missing."
    );
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(
        /\\n/g,
        "\n"
      ),
    }),
  });
}

const firebaseAuth = getAuth();

// --------------------
// MongoDB Setup
// --------------------

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is missing from environment variables."
  );
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbPromise = null;

function getCollections() {
  if (!dbPromise) {
    dbPromise = client
      .connect()
      .then(() => {
        console.log("Successfully connected to MongoDB!");

        const db = client.db(
          process.env.USER_DB || "smart-deal-db"
        );

        return {
          productsCollection: db.collection("products"),
          bidsCollection: db.collection("bids"),
        };
      })
      .catch((error) => {
        dbPromise = null;
        throw error;
      });
  }

  return dbPromise;
}

// --------------------
// Firebase Token Verification
// --------------------

const verifyFireBaseToken = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  try {
    const userInfo = await firebaseAuth.verifyIdToken(token);

    req.token_email = userInfo.email;

    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);

    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
};

// --------------------
// Root Route
// --------------------

app.get("/", (req, res) => {
  res.send("smart deal server is running");
});

// --------------------
// Database Middleware
// --------------------

app.use(async (req, res, next) => {
  try {
    const collections = await getCollections();

    req.productsCollection = collections.productsCollection;
    req.bidsCollection = collections.bidsCollection;

    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    return res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// --------------------
// Products API
// --------------------

// Get all products or filter by seller email
app.get("/products", async (req, res, next) => {
  try {
    const email = req.query.email;
    const query = {};

    if (email) {
      query.email = email;
    }

    const result = await req.productsCollection
      .find(query)
      .toArray();

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get one product
app.get("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const result = await req.productsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get the latest 9 products
app.get("/latestproducts", async (req, res, next) => {
  try {
    const result = await req.productsCollection
      .find()
      .sort({ created_at: -1 })
      .limit(9)
      .toArray();

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Add a product
app.post("/products", async (req, res, next) => {
  try {
    const newProduct = {
      ...req.body,
      created_at: new Date(),
    };

    const result = await req.productsCollection.insertOne(
      newProduct
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Delete a product
app.delete("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const result = await req.productsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Update a product
app.patch("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const { _id, ...updatedProduct } = req.body;

    const result = await req.productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// --------------------
// Bids API
// --------------------

// Get bids belonging to the authenticated buyer
app.get("/bids", verifyFireBaseToken, async (req, res, next) => {
  try {
    const email = req.query.email;

    if (email && email !== req.token_email) {
      return res.status(403).json({
        message: "Forbidden access",
      });
    }

    const result = await req.bidsCollection
      .find({ buyer_email: req.token_email })
      .sort({ bid_price: -1 })
      .toArray();

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get bids for a specific product
app.get("/products/bids/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;

    const result = await req.bidsCollection
      .find({ product: productId })
      .sort({ bid_price: -1 })
      .toArray();

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Add a bid
app.post("/bids", async (req, res, next) => {
  try {
    const newBid = req.body;

    const result = await req.bidsCollection.insertOne(newBid);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Delete a bid
app.delete("/bids/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid bid ID",
      });
    }

    const result = await req.bidsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// --------------------
// Not Found Handler
// --------------------

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// --------------------
// Error Handler
// --------------------

app.use((error, req, res, next) => {
  console.error("API error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

// --------------------
// Export Express App
// --------------------

module.exports = app;

// Run locally; Vercel uses the exported app.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Smart Deal server running on port ${port}`);
  });
}
