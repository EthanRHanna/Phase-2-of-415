const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
var fs = require("fs");
app.listen(port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri =
  "mongodb+srv://User:HPIx5GGvfwzjgGNF@cluster0.cllmezs.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

// GET All tickets
app.get("/rest/list/", function (req, res) {
  router.get(async (Dreq, Dres) => {
    try {
      let collection = await db.collection("SampleForProject");
      let results = await collection.find({}).limit(50).toArray();

      res.send(results).status(200);
    } catch (error) {
      res.status(404).send("Nothing");
    }
  });
});

// GET ticket by id
app.get("/rest/ticket/:id", function (req, res) {
  //JSON.parse treats id as a number thus we have to treat it as a number in input
  const inputId = Number(req.params.id);
  console.log("Looking for: " + inputId);

  router.get(async (Dreq, Dres) => {
    let collection = await db.collection("SampleForProject");
    let query = { _id: ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });
});

//A Delete request
app.delete("/rest/delticket/:id", function (req, res) {
  router.delete(async (Dreq, Dres) => {
    const query = { _id: ObjectId(req.params.id) };

    const collection = db.collection("SampleForProject");

    if (!(await collection.findOne(query))) {
      res.send(result).status(200);
    } else {
      let result = await collection.deleteOne(query);
    }

    res.send(result).status(200);
  });
});

// A POST request
app.post("/rest/ticket/", function (req, res) {
  const newTicket = req.body;

  //fields needed in the body
  const ticketInfo = [
    "id",
    "created_at",
    "updated_at",
    "type",
    "subject",
    "description",
    "priority",
    "status",
    "recipient",
    "submitter",
    "assignee_id",
    "follower_ids",
    "tags",
  ];
  //checking how many fields are missing
  const missingTicketInfo = ticketInfo.filter((field) => !(field in newTicket));

  //if more than 0 are missing then throw an error
  if (missingTicketInfo.length > 0) {
    return res.status(400).json({
      error: `Incomplete ticket info!\n Missing fields: ${missingTicketInfo.join(
        ", "
      )}`,
    });
  }

  //Adding new entry into database
  router.post(async (Dreq, Dres) => {
    let collection = await db.collection("SampleForProject");
    let newDocument = newTicket;
    newDocument.date = new Date();
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  });
});

//Update request
app.update("/rest/upticket/ticketUpdates/:id"),
  function (req, res) {
    router.patch(async (Dreq, Dres) => {
      const query = { _id: ObjectId(req.params.id) };
      const updates = {
        $push: { ticketUpdates: req.body },
      };

      let collection = await db.collection("posts");
      let result = await collection.updateOne(query, updates);

      res.send(result).status(200);
    });
  };
