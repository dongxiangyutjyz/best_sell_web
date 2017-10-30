const express = require("express");
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
const keys = require('./config/keys');
const {BrowserRouter, Route} = require('react-router-dom');
const React = require ('react');
const {Component} = require('react');
const { connect} = require ('react-redux');
const GoogleStrategy = require('passport-google-oauth20');
require('./models/User');

//authRoutes(app);
const app = express();
//Add


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(keys.mongoURI);

//declare the model of a product in mongoose
var productSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    contact: String,
    address: String,
    product: String,
    date: String,
    time: String,
    description: String,
    broken: String,
});
//declare the model of a user in mongoose
const userSchema = new mongoose.Schema({
  children: [productSchema] //takes product as children
});

mongoose.model('user',userSchema);
mongoose.model('product',productSchema);

var user = mongoose.model('user',userSchema);
var product = mongoose.model('product', productSchema);
const path = require('path');

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//TODO:implement the function that allows logged in users to see forms they filled
/*app.get("/myforms",(req,res) => {
    user.find({'googleId' : user.id},function(err,users){
      if(err){
        res.send("something went really wrong");
        next();
      }
      res.json(users);
    });
});*/

//Require a user to log in first in order to send a
app.post("/submit", (req, res) => {
  /*if (auth2.isSignedIn.get()) {
    var profile = auth2.currentUser.get().getBasicProfile();
    console.log('ID: '+profile.getId());
  }*/
    var myData = new user({children:req.body});
    myData.save()
        .then(item => {
            res.sendFile(path.resolve(__dirname,'aftersubmit.html'));
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
