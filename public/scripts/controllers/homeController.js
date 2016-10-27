myApp.controller('homeController', ['$scope', '$http', '$firebaseArray', '$firebaseAuth', '$location', function($scope, $http, $firebaseArray, $firebaseAuth, $location) {
    console.log('in homeController');

    var auth = $firebaseAuth();

    $scope.loggedIn = false;
    $scope.loggedOut = true;


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

              //google profile information to add to the database
              //admin default to false & active to true
              //can change these in emp Manage
              var objectToSend = {
                name:firebaseUser.displayName,
                admin: false,
                status: true,
                id:firebaseUser.uid,
                pic: firebaseUser.photoURL,
                email:firebaseUser.email
              };
              //store idToken in sessionStorage
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
                    //store google profile info in session storage
                    sessionStorage.userGoogleId = firebaseUser.uid;
                    sessionStorage.userDisplayName = firebaseUser.displayName;
                    sessionStorage.userPhotoUrl = firebaseUser.photoURL;
                    $scope.ifFirebaseUser(firebaseUser);
                }); //end then
            }); //end geToken
        } else {
            console.log('Not logged in.');
            //if null firebaseUser
            $scope.secretData = "Login Required";
        } //end else
    }); //end auth on status change


    // This code runs when the user logs out
    $scope.logOut = function() {
        auth.$signOut().then(function() {
            emptySessionStorage();
            location.reload();
            console.log('Logging the user out!');
            $scope.ifFirebaseUser();
        });//auth sign out
    };//end scope dot logOut

    //if user is logged in, show log out button and change views
    $scope.ifFirebaseUser = function (fbu) {
      if (fbu){
        $scope.loggedIn = true;
        $scope.loggedOut = false;
        $location.url('/userHome');
      }else {
        $scope.loggedIn = false;
        $scope.loggedOut = true;
        $location.url('/');
      }
    };

}]); //end controller

//clear session storage on log out
var emptySessionStorage = function() {
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('idToken');
}; // end emptyLocalStorage
