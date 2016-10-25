myApp.controller('manageProjectsController', ['$scope', '$http', 'factory', function ($scope, $http, factory){
  console.log('in manageProjectsController');

  //all projects
  $scope.allMyProjects = [];
  $scope.allEmployees = [];
  $scope.allProjectUsers = [];

  //get all projects
  $scope.getMyProjects = function () {
    factory.getMyProjects().then(function (results) {
     $scope.allMyProjects = results.data;
    });
  };

  //get all users by projects
  $scope.getProjectUsers = function (projectId) {
    console.log('in getProjectUsers');
    factory.getProjectUsers(projectId).then(function (response) {
      $scope.allProjectUsers = response.data;
    });
  };
  //edit time date
  //edit time description
  //make project active/inactive
  $scope.editProject = function (type, value) {
    console.log('in editProject');
    factory.editProject(type, value);
  };
  //get all employees
  $scope.getAllEmployees = function () {
    console.log('in getAllEmployees');
    factory.getAllEmployees().then(function (response) {
      $scope.allEmployees = response.data;
    });
  };
  //add projects
  $scope.addProject = function () {
    console.log('in addProject click');

    var projectName = $scope.projectNameModel;
    var projectStartDate = $scope.startDateModel;
    var projectEndDate = $scope.endDateModel;
    var projectClient = $scope.clientModel;
    var isActive = '';

    var todaysDate = new Date();
    if(projectEndDate >= todaysDate && projectStartDate <= todaysDate){
      isActive = true;
    }else{
      isActive = false;
    }

    console.log(projectName, projectStartDate, projectEndDate, projectClient, isActive);
    factory.addProject(projectName, projectStartDate, projectEndDate, projectClient, isActive).then(function (results) {
      if(results.data.success){
        $scope.addProjectSuccess = "Project sucessfully added!";
      }
    });


  };
  //edit project start date

  //edit project end date

  //add employees to project

  //remove employee from project

  //delete time

  //edit time hours



  //----------------test all of the below:
  $scope.getMyProjects();
  $scope.getProjectUsers(2);
  $scope.editProject(2, true);
  $scope.getAllEmployees();

}]);
