myApp.constant('moment', moment);

myApp.controller('homeController', ['$scope', '$http', '$firebaseArray', '$firebaseAuth', '$location', 'authFactory', function($scope, $http, $firebaseArray, $firebaseAuth, $location, authFactory) {


    console.log('in homeController');

    var auth = $firebaseAuth();

    $scope.loggedIn = false;
    $scope.loggedOut = true;


    // This code runs whenever the user logs in
    $scope.logIn = function login() {
        auth.$signInWithPopup("google").then(function(firebaseUser) {
            console.log("Signed in as:", firebaseUser);
            if (!firebaseUser.user.email.includes("@cimarronwinter.com")) {
                $scope.logOut();
                //change to @cimarronwinter.com to only allow cimarron emp's
                alert("Only Users with a @cimarronwinter.com account");
            } //end if
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
                    name: firebaseUser.displayName,
                    admin: false,
                    status: true,
                    id: firebaseUser.uid,
                    pic: firebaseUser.photoURL,
                    email: firebaseUser.email
                };
                $http({
                    method: 'POST',
                    url: '/api/users/verify',
                    data: objectToSend,
                    headers: {
                        id_token: idToken
                    } //end headers
                }).then(function(results) {
                    var user = results.data;
                    $scope.userProfile = authFactory.userProfile;
                    authFactory.store_users(user);
                    $scope.userProfile = authFactory.get_user();
                    console.log($scope.userProfile);
                    sessionStorage.userAuth = idToken;
                    console.log(firebaseUser, 'firebaseUser User');
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
        }
    });


    // This code runs when the user logs out
    $scope.logOut = function() {
        auth.$signOut().then(function() {
            emptySessionStorage();
            location.reload();
            console.log('Logging the user out!');
            $scope.ifFirebaseUser();
        }); //auth sign out
    }; //end scope dot logOut

    //if user is logged in, show log out button and change views
    $scope.ifFirebaseUser = function(fbu) {
        if (fbu) {
            $scope.loggedIn = true;
            $scope.loggedOut = false;
        } else {
            $scope.loggedIn = false;
            $scope.loggedOut = true;
            $location.reload();
        }
    };

}]); //end controller

//clear session storage on log out
var emptySessionStorage = function() {
    sessionStorage.removeItem('userProfile');
    sessionStorage.removeItem('idToken');
}; // end emptyLocalStorage
