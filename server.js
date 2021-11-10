//__________________________________
// DEPENDENCIES
//__________________________________
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
// pull MONGODB_URL from .env
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");

//__________________________________
// DATABASE CONNECTION
//__________________________________
// Establish Connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongo"))
  .on("close", () => console.log("Your are disconnected from mongo"))
  .on("error", (error) => console.log(error));

//__________________________________
// MODELS
//__________________________________
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

//__________________________________
// MiddleWare
//__________________________________
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

//__________________________________
// ROUTES
//__________________________________
// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});

// PEOPLE INDEX ROUTE
app.get("/cheese", async (req, res) => {
  try {
    // send all cheese
    res.json(await Cheese.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PEOPLE CREATE ROUTE
app.post("/cheese", async (req, res) => {
  try {
    // send all people
    res.json(await Cheese.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PEOPLE CREATE ROUTE
app.put("/cheese/:id", async (req, res) => {
  try {
    // send all people
    res.json(
      await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PEOPLE CREATE ROUTE
app.delete("/cheese/:id", async (req, res) => {
  try {
    // send all people
    res.json(await Cheese.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//__________________________________
// LISTENER
//__________________________________
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));