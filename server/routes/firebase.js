var router = require('express').Router();
var path = require('path');
var firebase = require('firebase');
var pg = require('pg');
var connectionString = 'postgress://localhost:5432/cimarron';


router.get("/dbcheck", function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {

        var clientUID = decodedToken.user_id;
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                console.log('connected to db');
                var resultsArray = [];
                //check if email in decodedToken has admin privliges
                var queryResults = client.query('SELECT isadmin FROM employee WHERE authid = $1', [clientUID]);
                queryResults.on('row', function(row) {
                    //push query to resultsArray
                    resultsArray.push(row);
                    console.log(resultsArray, 'Results');
                }); //end query results on row
                queryResults.on('end', function() {
                    done();
                    //send isAdmin from database to client
                    return res.send(resultsArray);
                }); //end queryResults on end
            } //end else
        }); //end pg connect
    }).catch(function(error) {
        console.log(error);
        // If the id_token isn't right, you end up in this callback function
        res.send("Sorry your Auth-Token was incorrect");
    }); //end catch
}); //end router dot get

module.exports = router;
