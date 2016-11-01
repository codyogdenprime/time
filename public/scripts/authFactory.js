myApp.factory('authFactory', ['$http', function($http) {
    console.log('in authFactory');
    var idToken = sessionStorage.getItem('userAuth');

     var userStatus = [];
   return {
      get_user: function() {
        console.log(userStatus,'in authFactory');
        var userProfile = "";
        var x;
        for (x in userStatus) {
            userProfile = userStatus[x];
        }
        console.log(userProfile.isactive, userProfile.isadmin, userProfile.empname,'in auth');
         return userProfile;

      },
      store_users: function (user) {
           userStatus = user;
      }
   };
}]); //end factory
