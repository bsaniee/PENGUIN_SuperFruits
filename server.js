/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path")

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
//////////////////////////
//Create our Fruits model
//////////////////////////
const {Schema, model} = mongoose //destructuring Schema and Model from mongoose

//make fruits Schema
const fruitSchema = new Schema({
    name: String,
    color: String, 
    readyToEat: Boolean, 
})

//Make the Fruit Model
const Fruit = model("Fruit", fruitSchema)

//log to test it exists
//console.log(Fruit)

//////////////////////////////////
//Create our app with object, configure liquid
/////////////////////////////////
const liquid = require("liquid-express-views")
//construct an absolute path to our views folder
const viewsFolder = path.resolve(__dirname, "views/")
//console.log(viewsFolder)

//creat eapp object with liquid, passing the path to the views folder
const app = liquid(express(), {root: viewsFolder})
//console.log(app)

////////////////////
//Register Middleware
///////////////////////
app.use(morgan("tiny"))
//ability to override request methods
app.use(methodOverride("_method"))
//ability to parse urlencoded bodies from form submissions\
app.use(express.urlencoded({extended: true}))
//setup public folder to serve files statically
app.use(express.static("public"))

//Routes
app.get("/", (req, res) => {
    res.send("Your server is running, better catch it")
})

//Fruits Routes

//seed route - seed our starter data
app.get("/fruits/seed", (req, res) => {
    //array of starter fruits
    const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false },
      ];
    // delete all fruits
    Fruit.deleteMany({})
    .then((data) => {
        // seed the starter fruits
        Fruit.create(startFruits)
        .then((data) => {
            // send created fruits back as JSON
            res.json(data)
        })
    })
})

//index route
app.get("/fruits", (req, res) => {
    Fruit.find({})
    .then((fruits) => {
        res.render("fruits/index.liquid", {fruits})
    })
        // error handling
        .catch((error) => {
            res.json({error})
        })
})

 //new route
 app.get("/fruits/new", (req, res) => {
     res.render("fruits/new.liquid")
 })

// create route
app.post("/fruits", (req, res) => {
    // check if the readyToEat property should be true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // create the new fruit
    Fruit.create(req.body)
      .then((fruits) => {
        // redirect user to index page if successfully created item
        res.redirect("/fruits");
      })
      // send error as json
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  });


  //edit route
  app.get("/fruits/:id/edit", (req, res) => {
      const id = req.params.id
      //get the fruit with matching id
      Fruit.findById(id)
      .then((fruit) => {
          res.render("fruits/edit.liquid", { fruit })
      })
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  })

  app.delete("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // delete the fruit
    Fruit.findByIdAndRemove(id)
      .then((fruit) => {
        // redirect to main page after deleting
        res.redirect("/fruits");
      })
      // send error as json
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  });

    //update route
    app.put("/fruits/:id", (req, res) => {
        // get the id from params
        const id = req.params.id;
        // check if the readyToEat property should be true or false
        req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
        // update the fruit
        Fruit.findByIdAndUpdate(id, req.body, { new: true })
          .then((fruit) => {
            // redirect to main page after updating
            res.redirect("/fruits");
          })
          // send error as json
          .catch((error) => {
            console.log(error);
            res.json({ error });
          });
      });

// show route
app.get("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id;
  
    // find the particular fruit from the database
    Fruit.findById(id)
      .then((fruit) => {
        // render the template with the data from the database
        res.render("fruits/show.liquid", { fruit });
      })
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  });

 

//////
//server listener
///////
const PORT = process.env.PORT
app.listen(PORT, () => 
    console.log(`listening on port ${PORT}`))
