myApp.controller('homeController', ['$scope', '$http', '$firebaseArray', '$firebaseAuth', function ($scope, $http, $firebaseArray, $firebaseAuth){
  console.log('in homeController');

  var auth = $firebaseAuth();


 sessionStorage.user = "mew";

   // This code runs whenever the user logs in
   $scope.logIn = function login(){

     auth.$signInWithPopup("google").then(function(firebaseUser) {
       console.log("Signed in as:", firebaseUser);
     }).catch(function(error) {
       console.log("Authentication failed: ", error);
     });
   };


   auth.$onAuthStateChanged(function(firebaseUser){
     // firebaseUser will be null if not logged in
     if(firebaseUser) {
       // This is where we make our call to our server
       firebaseUser.getToken().then(function(idToken){
         $http({
           method: 'GET',
           url: '/dbcheck',
           headers: {
             id_token: idToken
           }
         }).then(function(response){
           $scope.secretData = response.data;
           console.log($scope.secretData, 'response from server');
         });
       });
     }else{
       console.log('Not logged in.');
       $scope.secretData = "Log in to get some secret data.";
     }//end else
   });//end auth on status change

   // This code runs when the user logs out
   $scope.logOut = function(){
     auth.$signOut().then(function(){
        emptySessionStorage();
       console.log('Logging the user out!');
     });//end auth sign out
   };//end log out
}]);//end controller
var emptySessionStorage = function() {
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('idToken');
}; // end emptyLocalStorage
