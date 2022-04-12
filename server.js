const express = require('express');
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5002;

// Connecting to Atlas database (Multi-Cloud Database Service)
const uri = "mongodb+srv://parthgoel:<password>@cluster0.zkbb6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri);

client.connect();

// Adding response to the database
async function createResponse(client, newResponse){
    const result = await client.db("mola").collection("responses").insertOne(newResponse);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Handling POST Request
app.post('/api/response', (req, res) => {
  createResponse(client, req.body);
  res.send(
    'Submitted'
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));