myApp.factory('authFactory', ['$http', function($http) {
    console.log('in authFactory');
    var idToken = sessionStorage.getItem('userAuth');


    var userProfile = null;


        $http({
            method: 'POST',
            url: '/api/users/verify',
            data: objectToSend,
            headers: {
                id_token: idToken
            } //end headers
        }).then(function(results){
          console.log(results,'auth results ');
          userProfile = results.data;
        });
        return {
          user: function(callback){
              callback(userProfile);
          }
        };



}]); //end factory
