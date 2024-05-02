const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.qlha3qo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const BrandCollection = client.db("brandDB").collection("brand");
    // get
    app.get("/brand", async (req, res) => {
      const cursor = BrandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await BrandCollection.findOne(query);
      res.send(result);
    });
    // post method
    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await BrandCollection.insertOne(newBrand);
      res.send(result);
    });
    app.put("/brand/:id", async (req, res) => {
      const id = req.params.id;
      const updateBrand = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const Brand = {
        $set: {
          img: updateBrand.img,
          name: updateBrand.name,
          brandName: updateBrand.brandName,
          description: updateBrand.description,
          rating: updateBrand.rating,
        },
      };
      const result = await BrandCollection.updateOne(filter, Brand, options);
      res.send(result);
    });
    // deleted
    app.delete("/brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await BrandCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is Brand collection");
});

app.listen(port, () => {
  console.log(`consol is running on this port ${port}`);
});
