/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const path = require("path")
const FruitsRouter = require("./controllers/fruit")
const UserRouter = require("./controllers/user")
const session = require("express-session") //session middleware
const MongoStore = require("connect-mongo") //MongoStore
//////////////////////////

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
// middleware to set up session (req.session)
app.use(
    session({
        secret: process.env.SECRET,
        store: MongoStore.create({mongoUrl: process.env.DATABASE_URL}),
        saveUninitialized: true,
        resave: false
    })
)

//Routes
app.get("/", (req, res) => {
    res.render("index.liquid");
  });

// Register Fruits Router
app.use("/fruits", FruitsRouter)
// Register User Router
app.use("/user", UserRouter)

//////
//server listener
///////
const PORT = process.env.PORT
app.listen(PORT, () => 
    console.log(`listening on port ${PORT}`))
