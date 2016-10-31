myApp.factory('authFactory', ['$http', function($http) {
    console.log('in authFactory');
    var idToken = sessionStorage.getItem('userAuth');

     var userProfile = [];
   return {
      get_user: function() {
         return userProfile;
      },
      store_users: function (user) {
          //  userProfile.push(user);
           userProfile = user;
      }
   };
}]); //end factory
