require('dotenv').config(); // Imports all .env values
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use('/inc', express.static( path.resolve('./node_modules/angular') ) );

app.listen(process.env.PORT, function() {
    console.log('lisening on', process.env.PORT);
});


app.use(express.static(path.resolve('public')));
