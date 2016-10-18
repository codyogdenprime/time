require('dotenv').config(); // Imports all .env values
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var pg = require('pg');

app.use(bodyParser.json());

//port decision
app.listen(process.env.PORT, function() {
    console.log('lisening on', process.env.PORT);
});

//index route
var index = require('./routes/index');

//use public folder
app.use(express.static(path.resolve('public')));
