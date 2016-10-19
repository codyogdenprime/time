var bodyParser = require('body-parser');
var router = require('express').Router();
var path = require('path');
var pg = require ('pg');
var connectionString = 'postgres://localhost:5432/cimaron-winter';

router.use(bodyParser.urlencoded({extended:true}));

//report get route
router.get('/reports/?:userid',function(req, res){

    console.log('/reports get route hit');
    var username = req.params.userid;
    console.log('this is the username sent',username);
    pg.connect(connectionString, function(err, client, done){
      if(err){
        console.log(err);
      }else {
        var resultsArray = [];
        var queryResults;
        if (username === undefined) {
          queryResults = client.query('SELECT * FROM time');
        }else {
          queryResults = client.query('SELECT * FROM time WHERE empid = $1',[username]);
        }
        queryResults.on('row', function(row){
          resultsArray.push(row);
        });//on row function
        queryResults.on('end',function(){
          done();
          return res.send(resultsArray);
        });//on end function
      }//else
    });//pg.connect
});//get active users
module.exports = router;
