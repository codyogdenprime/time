myApp.controller('homeController', ['$scope', '$http', '$firebaseArray', '$firebaseAuth', function($scope, $http, $firebaseArray, $firebaseAuth) {
    console.log('in homeController');

    var auth = $firebaseAuth();


    // This code runs whenever the user logs in
    $scope.logIn = function login() {
        auth.$signInWithPopup("google").then(function(firebaseUser) {
            console.log("Signed in as:", firebaseUser);
            if (!firebaseUser.user.email.includes("@gmail.com")) {
                $scope.logOut();
                //change to @cimarronwinter.com to only allow cimarron emp's
                alert("Only Users with a @gmail.com account");
            }//end if
        }).catch(function(error) {
            console.log("Authentication failed: ", error);
        }); //end catch
    }; //end scope dot login

    auth.$onAuthStateChanged(function(firebaseUser) {

        // firebaseUser will be null if not logged in
        if (firebaseUser) {
            // This is where we make our call to our server

            firebaseUser.getToken().then(function(idToken) {
              console.log(sessionStorage,'storage``````');
              var objectToSend = {
                name:firebaseUser.displayName,
                admin: false,
                status: true,
                id:firebaseUser.uid,
                pic: firebaseUser.photoURL,
                email:firebaseUser.email
              };

              sessionStorage.userAuth = idToken;
                $http({
                    method: 'POST',
                    url: '/api/users/verify',
                    data: objectToSend,
                    headers: {
                        id_token: idToken
                    } //end headers
                }).then(function(response) {
                    $scope.secretData = response.data;
                    console.log($scope.secretData, 'response from server');
                    console.log(firebaseUser);
                    sessionStorage.userGoogleId = firebaseUser.uid;
                    sessionStorage.userDisplayName = firebaseUser.displayName;
                    sessionStorage.userPhotoUrl = firebaseUser.photoURL;

                }); //end then
            }); //end geToken
        } else {
            console.log('Not logged in.');
            $scope.secretData = "Log in to get some secret data.";
        } //end else
    }); //end auth on status change


    // This code runs when the user logs out
    $scope.logOut = function() {
        auth.$signOut().then(function() {
            emptySessionStorage();
            console.log('Logging the user out!');
        });//auth sign out
    };//end scope dot logOut

}]); //end controller

var emptySessionStorage = function() {
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('idToken');
}; // end emptyLocalStorage
