myApp.constant('moment', moment);

myApp.controller('manageProjectsController', ['$scope', '$http', 'factory', 'authFactory', function($scope, $http, factory, authFactory) {
    console.log('in manageProjectsController');

    // Hides the transition views
    $('.single-client').hide();
    $('single-project').hide();
    $('.modal').hide();

    $scope.clients = [];
    $scope.thisClient = '';
    $scope.currentProject = '';
    $scope.clientProjects = [];
    $scope.thisClient = '';

    var userProfile = authFactory.get_user();
    console.log(userProfile.isadmin);

  $scope.getClients = function(){
    factory.getAllClients().then(function(results) {
        $scope.clients = results.data;
        // console.log('data in getClients',$scope.clients);
    });//factory call
  };//getClients

  $scope.addClient = function(){
    factory.addClient().then(function(results) {
        $scope.confirmation = results.data;
        // console.log('confirmation from addClient',$scope.confirmation);
    });//factory call
  };//addClient

  //gets all projects for a single client
  $scope.showSingleClient = function(data){
    // console.log('showSingleClient() clicked clientid is ',data);
      $scope.thisClient = data;
    factory.getClientProjects(data).then(function(results){
      $scope.clientProjects = results.data;
      // console.log('back from showSingleClient', $scope.clientProjects);

        showSingleClient();
          // Transition from all client cards to a single client
    });//.then factory call
  };//showSingleClient

  $scope.showAddClient = function(){
    //get allClients again
    $scope.getClients();
    console.log($scope.getClients);
    showAddClient();
  };

  $scope.addProjectToNewClient = function(data){
    // console.log('client name in', data);
    factory.addClient(data).then(function(response) {
      $scope.thisClient = response.data.results[0].clientid;
      console.log('in new client', $scope.thisClient, response.data);
      addProjectToNewClient();
    });//
  };//addProjectToNewClient

  $scope.showClients = function(){
    $scope.getClients();
    showClients();
  };//showClients

  $scope.addProjectToClient = function() {
    console.log('in addProjectToClient', $scope.thisClient);
    factory.addProject($scope.projectIn, $scope.thisClient).then(function() {
  // console.log('scope.projectIn',$scope.projectIn+' scope.thisClient',$scope.thisClient);
    $scope.projectIn = undefined;
      addProjectToClient();
      factory.getClientProjects($scope.thisClient).then(function(results){
        $scope.clientProjects = results.data;
        // console.log('back from showSingleClient', $scope.clientProjects);
        $scope.getClients();
        showSingleClient();
        addProjectToNewClient();
        modalReset();
      });
    });
  };//addProjectToClient

  $scope.employees = function (empDrop) {
    console.log('in employees function',$scope.empDrop);
  };

  //add employees to project
  $scope.addEmpToProject = function() {
      console.log('in addEmpToProject', $scope.empDrop.empid, $scope.currentProject);
      factory.addEmpToProject($scope.empDrop.empid, $scope.currentProject).then(function () {
        $scope.getAllEmployeesNow();
      });
  };

  //get all projects
  $scope.getMyProjects = function() {
      factory.getMyProjects().then(function(results) {
          $scope.allMyProjects = results.data;
      });
  };

  //get all users by projects
  $scope.getProjectUsers = function(projectId) {
      console.log('in getProjectUsers');
      factory.getProjectUsers(projectId).then(function(response) {
          $scope.allProjectUsers = response.data;
      });
  };
  //edit project start date
  //edit project end date
  //make project active/inactive
  $scope.editProject = function(type, value, projectId) {
      console.log('in editProject');
      factory.editProject(type, value, projectId).then(function(response) {
          $scope.editProjectSuccess = response.data;
          console.log($scope.editProjectSuccess);
      });
  };
  //get all employees
  $scope.getAllEmployees = function(projectid) {
      console.log('in getAllEmployees', projectid);
      $scope.currentProject = projectid;
      factory.getProjectUsers(projectid).then(function (response) {
        $scope.allEmpsForThisProject = response.data;
        for (var i = 0; i < $scope.clientProjects.length; i++) {
          if($scope.clientProjects[i].projectid == projectid){
            $scope.currentProjectObject = $scope.clientProjects[i];
          }
        }
        console.log('got to then in getAllEmployees', $scope.allEmpsForThisProject);
        factory.getAllEmployees().then(function(response) {
          $scope.allEmployees = response.data;
          showSingleProject();
          console.log('allEmployees', $scope.allEmployees);
      });
    });
  };

  $scope.getAllEmployeesNow = function () {
    console.log('in getAllEmployeesNow');
    factory.getProjectUsers($scope.currentProject).then(function (response) {
      $scope.allEmpsForThisProject = response.data;
    });

  };
  //add projects
  $scope.addProject = function() {
      console.log('in addProject click');

      var projectName = $scope.projectNameModel;
      var projectStartDate = $scope.startDateModel;
      var projectEndDate = $scope.endDateModel;
      var projectClient = $scope.clientModel;
      var isActive = '';

      var todaysDate = new Date();
      if (projectEndDate >= todaysDate && projectStartDate <= todaysDate) {
          isActive = true;
      } else {
          isActive = false;
      }

      console.log(projectName, projectStartDate, projectEndDate, projectClient, isActive);

      factory.addProject(projectName, projectStartDate, projectEndDate, projectClient, isActive).then(function(results) {
          if (results.data.success) {
              $scope.addProjectSuccess = "Project sucessfully added!";
          }
      });
  }; //end addProject

  $scope.backToSingleClient = function () {
    console.log('in backToSingleClient click');
    factory.getClientProjects($scope.thisClient).then(function(results){
      $scope.clientProjects = results.data;
      // console.log('back from showSingleClient', $scope.clientProjects);

        backToSingleClient();
          // Transition from all client cards to a single client
    });
  };

  //remove employee from project
  $scope.removeEmpFromProject = function (empid) {
    console.log('in removeEmpFromProject', empid);
    factory.removeEmpFromProject(empid, $scope.currentProject).then(function (response) {
      console.log('in removeEmpFromProject', response.data);
      $scope.getAllEmployeesNow();
    });
  };
  //delete time
  $scope.deleteTimeEntry = function(timeId) {
      console.log('in deleteTimeEntry');
      factory.deleteTimeEntry(timeId);
  };

  $scope.getClients();

}]); //end manageProjectsController



//OUTSITE OF CONTROLLER
var showSingleClient = function() {
    // Transition from all client cards to a single client
    $('section.cards').fadeOutToLeft(function() {
        $('section.single-client').fadeInFromRight();
    });
}; //showSingleClient


var showAddClient = function() {
    $('.modal').show().addClass('modal-show');
    $('.modal__add-client input[type="text"]').focus();
}; //showAddClient

var addProjectToNewClient = function() {
    $('.modal__add-client').animate({
        top: "-200px",
        opacity: 0
    }, 300, function() {
        $(this).hide();
        $('.modal__add-project').show().css("opacity", 0).animate({
            opacity: 1
        }, 400);
        $('.modal__add-project input[type="text"]').focus();
    });
}; //add project to new client

var showClients = function() {
    // Transition back to all the clients
    $('section.single-client').fadeOutToRight(function() {
        $('section.clients').show().fadeInFromLeft();
        $('section.single-client').css('left', '200px');
    });
};
var modalReset = function() {
    if ($('.modal').hasClass('modal-show')) {
        $('.modal').removeClass('modal-show').hide();
    }
    $('.modal__add-project').css('opacity', 0).hide();
    $('.modal__add-client').show().css('top', '0px').css('opacity', 1);
};
var addProjectToClient = function() {
    $('.modal__add-client').hide();
    $('.modal__add-project').show().css('opacity', 1);
    $('.modal').show().addClass('modal-show');
};

var showSingleProject = function() {
    // Transition to single client.
    $('section.single-client').fadeOutToLeft(function() {
        $('section.single-project').fadeInFromRight();
    });
};

var backToSingleClient = function() {
    $('section.single-project').fadeOutToRight(function() {
        $('section.single-client').show().fadeInFromLeft();
    });
};
