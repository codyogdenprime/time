myApp.factory('factory', ['$http', function($http){
  console.log('in factory');

  var idToken = sessionStorage.getItem('userAuth');
  var isAdmin = true;

  var getAllEmployees = function () {
    console.log('got to getAllEmployees');
    return $http({
    method: 'GET',
    url: 'api/users',
    headers: {
      id_token: idToken}
    });//end http
  };//end getAllEmployees
  //check if a user already exists
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

  var getMyProjects = function () {
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
  //get all users for a specific project
  var getProjectUsers = function (projectId) {
    console.log('made it to getProjectUsers');

    return $http({
      method: 'GET',
      url: 'api/users/byProject/?projectId=' + projectId,
      headers: {
        id_token: idToken}
    });
  };//end getProjectUsers function

  var editProject = function (type, value) {
    console.log('made it to isProjectActive');
    var objectToSend = {
      type: type,
      value: value
    };

    return $http({
      method: 'PUT',
      url: 'api/projects',
      headers: {
        id_token: idToken}
    });
  };

  var addProject = function (name, start, end, client, active) {
    console.log('made it to addProject', name, start, end, client);
    var objectToSend = {
      projectname: name,
      startdate: start,
      enddate: end,
      client_id: client,
      isactive: active
    };
    return $http({
      method: 'POST',
      url: 'api/projects',
      data: objectToSend,
      headers: {
        id_token: idToken}
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
    addTime: addTime,
    getProjectUsers: getProjectUsers,
    editProject: editProject,
    addProject: addProject
  };

}]);
