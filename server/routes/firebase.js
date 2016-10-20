var router = require('express').Router();
var path = require('path');
var firebase = require('firebase');
var pg = require('pg');
var connectionString = 'postgress://localhost:5432/cimarron';


router.get("/dbcheck", function(req, res){


  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    var token = decodedToken;
    console.log(decodedToken);
    pg.connect(connectionString,function(err,client,done){
      var authid = token.user_id;
      if (err) {
        console.log(err);
      }else {
        console.log('db connected');
        var resultsArray = [];
        var queryResults = client.query('SELECT * from employee WHERE authid = $1',[authid]);
        queryResults.on('row', function(row){
            resultsArray.push(row);
        });//end query results row
        queryResults.on('end', function(){
          done();
          return res.send(resultsArray);
        });//end query results on end
      }//end else
    }).catch(function(error) {
      console.log(error);
      // If the id_token isn't right, you end up in this callback function
      res.send("No secret data for you!");
    });//end catch
  });//end firebase auth
});//end router dot get

module.exports = router;
