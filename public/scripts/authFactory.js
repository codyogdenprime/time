myApp.factory('authFactory', ['$http', function($http) {
    console.log('in authFactory');
    var idToken = sessionStorage.getItem('userAuth');


    var getUserInfo = function(objectToSend, idToken) {
        return $http({
            method: 'POST',
            url: '/api/users/verify',
            data: objectToSend,
            headers: {
                id_token: idToken
            } //end headers
        });
    };
    return {
        getUserInfo: getUserInfo
    };

}]); //end factory
