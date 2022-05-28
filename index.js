const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config()
const path = require("path")
const port = process.env.PORT || 8000;


//MongoDB local URL
const database = "mongodb+srv://Malushka1:Malushka1@cluster0.xp193.mongodb.net/?retryWrites=true&w=majority";
//mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// DB connection
mongoose.connect(database, {useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log(`MongoDB connected ${database} `))
.catch(err => console.log(err));

//express instance
const app = express();

//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "client", "build")))

//Routes
app.use('/', require('./api/api'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


//start your server on port 5000
app.listen(port, () => {
  console.log('Server Listening on port 8000');
});