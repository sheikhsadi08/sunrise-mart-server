const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();

const port = 5000;

app.get('/', (req,res) => {
  res.send('working');
})


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




//  connect to database..
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g00s5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("sunrise-mart").collection("products");

  app.get('/products', (req,res) => {
    collection.find({})
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.get('/product/:price', (req,res) => {

    collection.find({ price: req.params.price})
    .toArray((err, items) => {
      res.send(items[0]);
    })
  })

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    collection.insertOne(product)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

});


client.connect(err => {
  const collection = client.db("sunrise-mart").collection("orderedProducts");

  app.get('/orderedProducts', (req,res) => {
    collection.find({})
    .toArray((err, items) => {
      res.send(items);
    })
  })


  app.post('/orderProduct', (req, res) => {
    const productOrder = req.body;
    collection.insertOne(productOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

});

app.listen(process.env.PORT || port);