var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var firebase = require('firebase');

router.route('/time')
    //selecting all from time table
    .get(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('time get route hit');
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                    var resultsArray = [];
                    var queryResults = client.query('SELECT * FROM time');
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

//add a time instance
.post(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('time post route hit');
            var data = req.body;
            console.log('data which is also req.body', data);
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                    var query = client.query('INSERT INTO time (date, hours, description, empid, projectid) VALUES ($1,$2,$3,$4,$5)', [data.date, data.hours, data.description, data.empid, data.projectid]);
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

//update time table
//expects an object that includes a key of projid and one of the following: date,hours,description,empid
.put(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('/time put route');
            var data = req.body;
            console.log("data logged here", data);
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                    var column = '';
                    var updatedInfo = '';
                    //build sql statement based on data in
                    switch (data.type) {
                        case 'date':
                            column = 'date';
                            break;
                        case 'hours':
                            column = 'hours';
                            break;
                        case 'description':
                            column = 'description';
                            break;
                        case 'empid':
                            column = 'empid';
                            break;
                        default:
                    }
                    updatedInfo = data.value;
                    client.query('UPDATE time SET ' + column + ' = $1 WHERE timeid = $2', [updatedInfo, data.timeid]);
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
    }) //.put route


//finds by timeid and deletes the whole thing
.delete(function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        var data = req.body;
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var query = client.query('DELETE FROM time WHERE timeid = $1', [data.timeid]);
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
}); //delete function


module.exports = router;
