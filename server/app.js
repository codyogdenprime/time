require('dotenv').config(); // Imports all .env values
var firebase = require('firebase');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var pg = require('pg');

//use public folder
app.use(express.static(path.resolve('public')));

app.use('/inc', express.static(path.resolve('./node_modules/angularjs-datepicker/dist')));
app.use('/inc/editable', express.static(path.resolve('./node_modules/angular-xeditable/dist')));
app.use('/inc', express.static(path.resolve('./node_modules/angular')));
app.use('/inc', express.static(path.resolve('./node_modules/jquery/dist')));
app.use('/inc', express.static(path.resolve('./node_modules/angular-route')));
app.use('/inc', express.static(path.resolve('./node_modules/firebase')));
app.use('/inc', express.static(path.resolve('./node_modules/angularfire/dist')));
app.use('/inc', express.static(path.resolve('./node_modules/alasql/dist')));
app.use('/inc', express.static(path.resolve('./node_modules/alasql/node_modules/xlsx/dist')));
app.use('/inc', express.static(path.resolve('./node_modules/xlsx/dist')));

app.use('/inc', express.static(path.resolve('./node_modules/normalize.css')));
app.use('/inc/fa', express.static(path.resolve('./node_modules/font-awesome/')));
//.json body parser
app.use(bodyParser.json());

//listen and port decision
app.listen(process.env.PORT, function() {
    console.log('listening on', process.env.PORT);
}); //end app.listen

//firebase init
firebase.initializeApp({
    serviceAccount: "./server/firebase-service-account.json",
    databaseURL: "https://cimarron-1d0ea.firebaseio.com"
}); //end firebase initializeApp

//index route
var index = require('./routes/index');
//users route
var users = require('./routes/api/users');
app.use('/api', users);
// time route
var time = require('./routes/api/time');
app.use('/api', time);
// reports route
var reports = require('./routes/api/reports');
app.use('/api', reports);
// projects route
var projects = require('./routes/api/projects');
app.use('/api', projects);
//clients route
var clients = require('./routes/api/clients');
app.use('/api', clients);
//use public folder
app.use(express.static(path.resolve('public')));
