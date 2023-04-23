const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
var fs = require("fs");
const { error } = require("console");
app.listen(port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri =
  "mongodb+srv://User:HPIx5GGvfwzjgGNF@cluster0.cllmezs.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

var updateId = -1;

app.get("/form", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  fs.readFile("./formFile.html", "utf8", (err, contents) => {
    if (err) {
      console.log("Form file Read Error", err);
      res.write("<p>Form file Read Error</p>");
    } else {
      console.log("Form loaded\n");
      res.write(contents + "<br>");
    }
    res.end();
  });
});

// GET All tickets
app.get("/rest/list/", function (req, res) {
  async function run() {
    try {
      let collection = await client
        .db("cluster0")
        .collection("SampleForProject");
      let results = await collection.find({}).limit(50).toArray();

      res.send(results).status(200);
    } catch (error) {
      res.status(404).send("Nothing");
    }
  }

  run().catch(console.log(error));
});

//Get ticket by id
app.get("/rest/ticket/:id", function (req, res) {
  //JSON.parse treats id as a number thus we have to treat it as a number in input
  const inputId = Number(req.params.id);
  console.log("Looking for: " + inputId);

  async function run() {
    let collection = await client.db("cluster0").collection("SampleForProject");
    let query = { _id: inputId };
    let result = await collection.findOne(query);

    if (!result) res.send("Ticket Not found").status(404);
    else res.send(result).status(200);
  }

  run().catch(console.log(error));
});

//A Delete request
app.delete("/rest/delete/:id", function (req, res) {
  async function run() {
    const query = { id: req.params.id };

    let collection = await client.db("cluster0").collection("SampleForProject");

    if (!(await collection.findOne(query))) {
      res.send("There is no Ticket");
    } else {
      let result = await collection.deleteOne(query);
      res.send(result).status(200);
    }
  }

  run().catch(console.log(error));
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
  async function run() {
    let collection = await client.db("cluster0").collection("SampleForProject");
    let newDocument = newTicket;
    newDocument.date = new Date();
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  }

  run().catch(console.log(error));
});

//Update request
app.get("/rest/update/:id"),
  function (req, res) {
    const inputId = req.params.id;
    console.log("Looking for: " + inputId);

    const updatedTicket = req.body;

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
    ];

    //checking how many fields are missing
    const missingTicketInfo = ticketInfo.filter(
      (field) => !(field in updatedTicket)
    );

    //if more than 0 are missing then throw an error
    if (missingTicketInfo.length > 0) {
      return res.status(400).json({
        error: `Incomplete ticket info!\n Missing fields: ${missingTicketInfo.join(
          ", "
        )}`,
      });
    }

    async function run() {
      let newDocument = updatedTicket;
      newDocument.date = new Date();

      const query = { id: inputId };
      const updates = {
        $set: { newDocument },
      };

      let collection = await client
        .db("cluster0")
        .collection("SampleForProject");
      await collection.updateOne(query, updates);
      let result = await collection.findOne(query);
      res.send(result).status(200);
    }
    run().catch(console.log(error));
    res.write();
  };
