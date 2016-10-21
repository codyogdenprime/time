myApp.factory('factory', ['$http', function($http){
  console.log('in factory');


  var getAllEmployees = function () {
    console.log('got to getAllEmployees');
    return $http({
    method: 'GET',
    url: 'api/employees'
    });//end http
  };//end getAllEmployees

  return {
    getAllEmployees: getAllEmployees
  };

}]);
