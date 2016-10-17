var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.listen('3000', function(){
  console.log('lisening on 3000');
});


app.use(express.static('public'));
