myApp.constant('moment', moment);

myApp.controller('empManageController', ['$scope', '$http', 'factory', function($scope, $http, factory) {
    console.log('in empManageController');

    $scope.allEmployees = [];


    //get all employees WHERE isadmin = false
    //happens on page load feel free to change.....
    $scope.init = function() {
        factory.getAllEmployees().then(function(results) {
            $scope.allEmployees = results.data;
            console.log('all employee array',$scope.allEmployees);
        });

    };//init function

    //toggles adminStatus or active status for clicked employee
    //usable for toggling active and inactive status, just send empid and 'activestatus' as type
    $scope.toggleStatus = function(empid,type){
      console.log('Status clicked');

       factory.toggleStatus(empid,type).then(function(results){
         console.log('this is in the .then function');
         factory.getAllEmployees().then(function(results) {
             $scope.allEmployees = results.data;
             console.log('all employee array coming from the update function',$scope.allEmployees);
         });
    });//.then function
  };//toggleAdminStatus

    // get all Active employees including Admin's
    // $scope.getActiveEmp = function(){factory.getActiveEmp().then(function(results) {
    //     $scope.allActiveEmp = results.data;
    //     console.log($scope.allActiveEmp, 'All Active Emp');
    //   }); //.then function
    // };//end getActiveEmp
    //
    // // Get Inactive employees
    // $scope.getInActiveEmp = function(){
    //   factory.getInActiveEmp().then(function(results) {
    //     $scope.InActiveEmp = results.data;
    //     console.log($scope.InActiveEmp, 'All Inactive Emp');
    //   });//.then function
    // }; //end getInActiveEmp
    //
    // //set emp status active/admin
    // $scope.empStatus = function() {
    //     //grab data from user empId and isactive or isadmin
    //     //if checked send adminstatus //if toggles green send activeStatus black activeStatus
    //     var objectToSend = {
    //         empid: 17, //of selected employee
    //         type: 'adminStatus' // set to activeStatus or adminStatus based on whats selected
    //     };
    //     //send object to factory http call
    //     factory.changeIsAdmin(objectToSend).then(function(results) {
    //         console.log(results);
    //     });
    // };
    //run on page load
    $scope.init();

}]);
