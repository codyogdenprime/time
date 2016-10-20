var router = require('express').Router();
var path = require('path');
var firebase = require('firebase');
var pg = require('pg');
var connectionString = 'postgress://localhost:5432/cimarron';


router.get("/dbcheck", function(req, res){

  /* This is where the magic happens. We pull the idtoken off of the request,
  verify it against our private_key, and then we return the decodedToken */
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    /* Whatever you do in here is protected by your authorization.
    WARNING: So far you are returning secret data to ANYONE who is logged in
    there is still more work to be done if you want to implement roles
    You can use the decodedToken and some logic to do that. */
    var token = decodedToken;
    console.log(decodedToken); // Here you can see the information firebase gives you about the user
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
  });
});//end router dot get

module.exports = router;
