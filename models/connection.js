///////////////////////////
//Import dependencies
///////////////////////////
require("dotenv").config() //loading .env variables
const mongoose = require("mongoose")

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG);

// Events for when connection opens/disconnects/errors
mongoose.connection
  .on("open", () => console.log("Connected to mongo"))
  .on("close", () => console.log("Disconnected from mongo"))
  .on("error", (error) => console.log(error));

  //////////////////////
  // Export the Connection
  //////////////////////
  module.exports = mongoose