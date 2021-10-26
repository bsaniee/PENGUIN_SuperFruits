////////////////////////////
//import dependencies
////////////////////////////
const express = require("express") //express for Router function
const Fruit = require("../models/fruit") //fruit model

////////////////////
// Create router
////////////////////
const router = express.Router()

////////////////////////////////
// Routes
////////////////////////////////

//seed route - seed our starter data
router.get("/seed", (req, res) => {
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
router.get("/", (req, res) => {
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
 router.get("/new", (req, res) => {
     res.render("fruits/new.liquid")
 })

// create route
router.post("/", (req, res) => {
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
  router.get("/:id/edit", (req, res) => {
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

  router.delete("/:id", (req, res) => {
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
    router.put("/:id", (req, res) => {
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
router.get("/:id", (req, res) => {
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

///////////////////////////////
//export router
///////////////////////////////
module.exports = router