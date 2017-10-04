var express = require("express");
var app = express();
const cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
const keys = require('./config/keys');
const passport = require('passport');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 *60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send(req.body);
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
