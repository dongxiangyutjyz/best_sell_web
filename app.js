const express = require("express");
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
const keys = require('./config/keys');
const passport = require('passport');
const {BrowserRouter, Route} = require('react-router-dom');
const React = require ('react');
const {Component} = require('react');
const { connect} = require ('react-redux');
const actions =require ('./actions');
const GoogleStrategy = require('passport-google-oauth20');
const requireLogin = require('./middlewares/requireLogin');
require('./models/User');
require('./services/passport');

//authRoutes(app);
const app = express();
//Add


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(keys.mongoURI);

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 *60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

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
    googleId: String
});

const userSchema = new mongoose.Schema({
  googleId: String,
  children: [productSchema]
});

mongoose.model('user',userSchema);
mongoose.model('product',productSchema);

var user = mongoose.model('user',userSchema);
var product = mongoose.model('product', productSchema);
const path = require('path');

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

/*app.get("/myforms",(req,res) => {
    user.find({'googleId' : user.id},function(err,users){
      if(err){
        res.send("something went really wrong");
        next();
      }
      res.json(users);
    });
});*/

app.post("/submit", requireLogin,(req, res) => {
  /*if (auth2.isSignedIn.get()) {
    var profile = auth2.currentUser.get().getBasicProfile();
    console.log('ID: '+profile.getId());
  }*/
    var myData = new user({children:req.body,googleId:user.id});
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
