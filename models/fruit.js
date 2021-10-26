////////////////////////////////////
// import dependencies
////////////////////////////////////
// import the existing connected mongoose object from connection.js
const mongoose = require("./connection")

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

///////////////////////////
// Export fruit model
//////////////////////////
module.exports = Fruit