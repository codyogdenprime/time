myApp.factory('factory', ['$http', function($http){
  console.log('in factory');


  var isAdmin = '';

  var getAllEmployees = function () {
    console.log('got to getAllEmployees');
    return $http({
    method: 'GET',
    url: 'api/employees'
    });//end http
  };//end getAllEmployees

  var checkUserDB = function (id, name, photo) {
    console.log('got into checkUserDB');
    return $http({
      method: 'GET',
      url: '/dbcheck/?clientUID=' + id + '&' + name + '&' + photo
    });
  };

  var changeIsAdmin = function (id) {
    isAdmin = id;
    console.log('is admin set to:', isAdmin);
  };

  var getMyProjects = function (id) {
    console.log('into factory getMyProjects');
      if(isAdmin){
        return $http({
          method: 'GET',
          url: 'api/projects/'
        });
      }else {
        //add an http call for if not admin send ID
      }

  };

  var getAllMyTime = function (project) {
    console.log('made it to getAllMyTime');
  };

  return {
    getAllEmployees: getAllEmployees,
    checkUserDB: checkUserDB,
    isAdmin: function () {
      return isAdmin;
    },
    changeIsAdmin: changeIsAdmin,
    getMyProjects: getMyProjects,
    getAllMyTime: getAllMyTime
  };

}]);
