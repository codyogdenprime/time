myApp.factory('factory', ['$http', function($http){
  console.log('in factory');

  var idToken = sessionStorage.getItem('userAuth');
  var isAdmin = true;

  var getAllEmployees = function () {
    console.log('got to getAllEmployees');
    return $http({
    method: 'GET',
    url: 'api/employees',
    headers: {
      id_token: idToken}
    });//end http
  };//end getAllEmployees

  var checkUserDB = function (id, name, photo) {
    console.log('got into checkUserDB');
    return $http({
      method: 'GET',
      url: '/dbcheck/?clientUID=' + id + '&' + name + '&' + photo,
      headers:{
        id_token: idToken}
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
          url: 'api/projects/',
          headers: {
            id_token: idToken}
        });
      }else {
        //add an http call for if not admin send ID
      }

  };

  var getAllMyTime = function (project) {
    console.log('made it to getAllMyTime');
    return $http({
      method: "GET",
      url: 'api/time',
      headers: {
        id_token: idToken}
    });
  };

  var addTime = function (objectToSend) {


  return $http({
    method: 'POST',
    url: 'api/time',
    headers: {
      id_token: idToken},
    data: objectToSend
  });
};
  return {
    getAllEmployees: getAllEmployees,
    checkUserDB: checkUserDB,
    isAdmin: function () {
      return isAdmin;
    },
    changeIsAdmin: changeIsAdmin,
    getMyProjects: getMyProjects,
    getAllMyTime: getAllMyTime,
    addTime: addTime
  };

}]);
