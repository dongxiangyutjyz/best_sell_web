const express = require("express");
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const keys = require('./config/keys');
const { connect} = require ('react-redux');
require('./models/User');

//authRoutes(app);
const app = express();

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

app.post("/submit", (req, res) => {
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
