var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var firebase = require('firebase');


router.route('/clients')
    .get(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('clients get route hit');
            pg.connect(connectionString, function(err, client, done) {
                // var data = client.query;
                if (err) {
                    console.log(err);
                } else {
                    var resultsArray = [];
                    var queryResults;
                    queryResults = client.query('SELECT * FROM clients');
                    queryResults.on('row', function(row) {
                        resultsArray.push(row);

                    }); //on row function
                    queryResults.on('end', function() {
                        done();
                        return res.send(resultsArray);
                    }); //on end function
                } //else
            }); //pg.connect
        }).catch(function(error) {
            console.log(error);
            // If the id_token isn't right, you end up in this callback function
            res.send("Sorry your Auth-Token was incorrect");
        }); //end catch
    }) //router.get

//add an employee
.post(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('projects post route hit');
            var data = req.body;
            console.log('data which is also req.body', data);
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                    // clientname
                    var query = client.query('INSERT INTO clients (clientname) VALUES ($1)', [data.clientname]);
                    res.send({
                        success: true
                    });
                } //else bracket
            }); //pg.connect
        }).catch(function(error) {
            console.log(error);
            // If the id_token isn't right, you end up in this callback function
            res.send("Sorry your Auth-Token was incorrect");
        }); //end catch
    }) //post route

//edits projects table expects an object like this {clientid: whatever  clientname: whatever updated clientname you want}
.put(function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        console.log('put route');
        var data = req.body;
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                client.query('UPDATE clients SET clientname = $1 WHERE clientid = $2', [data.clientname, data.clientid]);
                res.send({
                    success: true
                });
            } //else
        }); //pg.connect
    }).catch(function(error) {
        console.log(error);
        // If the id_token isn't right, you end up in this callback function
        res.send("Sorry your Auth-Token was incorrect");
    }); //end catch
}); //.put route
module.exports = router;
