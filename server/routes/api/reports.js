var bodyParser = require('body-parser');
var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var firebase = require('firebase');

router.use(bodyParser.urlencoded({
    extended: true
}));

//report get route
router.get('/reports', function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        console.log('/reports get route hit');
        var objectIn = {
            username: req.query.userid,
            projectId: Number(req.query.projectId),
            sDate: req.query.sDate,
            eDate: req.query.eDate
        };
        console.log('this is the info sent', objectIn);
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var resultsArray = [];
                var queryResults;

                //object properties expected req.query{userid,projectId,sDate,eDate}

                if (objectIn.username !== undefined && objectIn.sDate !== undefined && objectIn.eDate !== undefined) {
                    queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1 AND empid = $2 AND time.date >= $3 AND time.date <= $4', [objectIn.projectId, objectIn.username, objectIn.sDate, objectIn.eDate]);
                    // console.log('test thing one');
                } else if (objectIn.sDate !== undefined && objectIn.eDate !== undefined) {
                    queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1 AND time.date >= $2 AND time.date <= $3', [objectIn.projectId, objectIn.sDate, objectIn.eDate]);
                    // console.log('test thing two');
                } else {
                    queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1', [objectIn.projectId]);
                    // console.log('test thing three');
                }
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
}); //get active users
module.exports = router;
