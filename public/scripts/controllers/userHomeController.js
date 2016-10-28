myApp.controller('userHomeController', ['$scope', '$http', 'factory', function($scope, $http, factory) {
    console.log('in userHomeController');

    $scope.allMyProjects = [];
    $scope.allMyTime = [];

    var userUID = sessionStorage.getItem('userGoogleId');
    var userDisplayName = sessionStorage.getItem('userDisplayName');
    var userPhotoURL = sessionStorage.getItem('userPhotoUrl');


    // $scope.checkUserDB = function (id, name, photo) {
    //   factory.checkUserDB(id, name, photo);
    //   //.then(function (results) {
    //     //console.log(results);
    //   //   if(results){
    //   //     //if user get all user projects
    //   //   }else if{
    //   //     //if not user, user setup, get projects, if no projects none assigned
    //   //   }else{
    //   //     //if admin, get projects, change view to admin view
    //   //   }
    //
    //   //});
    //   //$scope.getMyProjects(id);
    //   //$scope.getAllTime();
    // };
    //get all projects for the user
    $scope.getMyProjects = function(arg) {
        factory.getMyProjects(arg).then(function(results) {
            $scope.allMyProjects = results.data;
        });
    };
    //
    // //if project is clicked get time for that projects
    $scope.getAllTime = function(project) {
        console.log('in getAllTime click');
        factory.getAllMyTime(project).then(function(results) {
            $scope.allMyTime = results.data;
        });
    };
    //add new time
    $scope.newTime = function(projectId, empid) {
        var objectToSend = {
            date: '16-5-6', //$scope.timeDate,
            hours: 4, //$scope.timeHours,
            description: 'none', //$scope.timeDescription,
            projectid: projectId,
            empid: empid
        }; //end object

        factory.addTime(objectToSend).then(function() {
            console.log('new time worked!');
        });
    };

    // $scope.deleteTimeEntry = function () {
    //
    // }

    // $scope.editTimeEntry = function (type) {
    //   var objectToSend = {
    //     type: type,
    //     timeId: timeId,
    //
    //   };
    //
    //
    //   }
    // };

    //$scope.checkUserDB(userUID, userDisplayName, userPhotoURL);
    //$scope.newTime(2, 4);
    //$scope.getMyProjects(2);
    //$scope.getAllTime(2);
}]);
