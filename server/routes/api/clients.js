// var router = require('express').Router();
// var path = require('path');
// var pg = require ('pg');
// var connectionString = 'postgres://localhost:5432/cimaron-winter';
// var firebase = require('firebase');
//
// router.route('/time')
// //selecting all from time table
// .get(function(req, res) {
//   firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
//   console.log('time get route hit');
//   pg.connect(connectionString, function(err, client, done){
//     if(err){
//       console.log(err);
//     }else {
//       var resultsArray = [];
//       var queryResults = client.query('SELECT * FROM time');
//       queryResults.on('row', function(row){
//         resultsArray.push(row);
//       });//on row function
//       queryResults.on('end',function(){
//         done();
//         return res.send(resultsArray);
//       });//on end function
//     }//else
//   });//pg.connect
// }).catch(function(error){
//   console.log(error);
//   // If the id_token isn't right, you end up in this callback function
//   res.send("Sorry your Auth-Token was incorrect");
// });//end catch
// })//router.get
// .post(function(req,res){})
// .put(function(req,res){});
