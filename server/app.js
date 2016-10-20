require('dotenv').config(); // Imports all .env values
var firebase = require('firebase'); //f
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var pg = require('pg');
var connectionString = 'postgress://localhost:5432/cimarron';

//use public folder
app.use(express.static(path.resolve('public')));

//.json body parser
app.use(bodyParser.json());

//listen and port decision
app.listen(process.env.PORT, function() {
    console.log('listening on', process.env.PORT);
});//end app.listen

//firebase init
firebase.initializeApp({
serviceAccount:"./server/firebase-service-account.json",
databaseURL:"https://cimarron-1d0ea.firebaseio.com"
});//end firebase initializeApp

//index route
var index = require('./routes/index');

//firebase route 
var firebase = require('./routes/firebase');
app.use('/', firebase);

//pull in angular to project
app.use('/inc', express.static( path.resolve('./node_modules/angular') ) );
