require('dotenv').config(); // Imports all .env values
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/';

app.listen(process.env.PORT, function() {
    console.log('lisening on', process.env.PORT);
});


app.use(express.static(path.resolve('public')));

app.get('/stuff', function(){
  pg.connect(connectionString,function)
});
