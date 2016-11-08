myApp.constant('moment', moment);

myApp.controller('manageProjectsController', ['$scope', '$http', 'factory', 'authFactory', 'reportFactory', function($scope, $http, factory, authFactory, reportFactory) {
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
    $scope.allProjectUsers = [];
    $scope.allEmpsForThisProject = [];
    $scope.selectedEmp = '';
    var userUID = sessionStorage.getItem('userGoogleId');

    $(function() {
        $("#datepicker").datepicker({
            "dataformat": "yy-mm-dd"
        });
    });

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
      $scope.currentClient = this.client;
      console.log(this.client);
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
    if (data !== undefined){
      factory.addClient(data).then(function(response) {
        $scope.thisClient = response.data.results[0].clientid;
        console.log('in new client', $scope.thisClient, response.data);
        addProjectToNewClient();
      });//
    }
  };//addProjectToNewClient

  $scope.showClients = function(){
    $scope.getClients();
    showClients();
  };//showClients

  $scope.addProjectToClient = function() {
    console.log('in addProjectToClient', $scope.thisClient);
    if($scope.projectIn !== undefined){
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
    }
  };//addProjectToClient

  $scope.employees = function (empDrop) {
    console.log('in employees function',$scope.empDrop);
  };

  //add employees to project
  $scope.addEmpToProject = function() {
    var alreadyAssigned = false;
    console.log('in addEmpToProject', $scope.allEmpsForThisProject);
    for (var i = 0; i < $scope.allEmpsForThisProject.length; i++) {
      console.log('in addEmpToProject', $scope.allEmpsForThisProject[i].empid, $scope.empDrop.empid);
      if($scope.allEmpsForThisProject[i].empid == $scope.empDrop.empid){
        alreadyAssigned = true;
      }
    }
    if (alreadyAssigned== false){
      //console.log('in addEmpToProject', $scope.empDrop.empid, $scope.currentProject);
      factory.addEmpToProject($scope.empDrop.empid, $scope.currentProject).then(function () {
        $scope.getAllEmployeesNow();
      });
    }
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
  $scope.editProject = function(projectId, type, value) {
      console.log('in editProject', projectId, type, value);
      factory.editProject(type, value, projectId).then(function(response) {
          $scope.editProjectSuccess = response.data;
          console.log($scope.editProjectSuccess);
          factory.getClientProjects($scope.thisClient).then(function(results){
            $scope.clientProjects = results.data;
          });
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
          $scope.getTimeForThisProject();
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

  $scope.getTimeForThisProject = function () {
    console.log('in getTimeForThisProject');
    reportFactory.getReportsByProject($scope.currentProject).then(function (response) {
      console.log(response);
      $scope.allTimeForThisProject = response.data;
      $scope.allTimeForThisProject = $scope.allTimeForThisProject.map(function(index) {
          console.log(index);
          var m = moment(index.date).format('M/D/YY');
          console.log(m);
          for (var i = 0; i < $scope.allEmpsForThisProject.length; i++) {
            console.log('$scope.allEmpsForThisProject', $scope.allEmpsForThisProject);
            if($scope.allEmpsForThisProject[i].empid == index.empid)
            var changeToName = $scope.allEmpsForThisProject[i].empname;
          }
          return ({
              timeid: index.timeid,
              date: m,
              hours: index.hours,
              description: index.description,
              empid: index.empid,
              empname: changeToName
          });//end return
      });//end map
      console.log('$scope.allTimeForThisProject', $scope.allTimeForThisProject);
      $scope.addAllHours();
    });//end factory call then
  };//end getTimeForThisProject

  $scope.addAllHours = function() {
      $scope.allHoursAdded = 0;
      for (var i = 0; i < $scope.allTimeForThisProject.length; i++) {
          console.log(Number($scope.allTimeForThisProject[i].hours));
          $scope.allHoursAdded += Number($scope.allTimeForThisProject[i].hours);
      }
      console.log('added all hours:', $scope.allHoursAdded);
  };

  $scope.newTime = function() {
    var newDate = moment($('#datepicker').val()).format('YYYY-MM-DD');
      var objectToSend = {
          date: newDate,
          hours: $scope.timeInputModel,
          description: $scope.descriptionInputModel,
          projectid: $scope.currentProject,
          empid: $scope.selectedEmp.empid
      }; //end object

      console.log('in newTime', objectToSend);

      factory.addTimeWithEmp(objectToSend).then(function() {
          console.log('new time worked!');
          $scope.getTimeByProjectAndEmp($scope.selectedEmp.empid); //----------------------
      });
      $scope.dateInputModel = '';
      $scope.timeInputModel = '';
      $scope.descriptionInputModel = '';
  };

  $scope.selectThisEmp = function (empid, empname) {
    console.log('in selectThisEmp click');
    $scope.selectedEmp = {empid: empid, empname: empname};
    console.log('in selectThisEmp', empid);
    $scope.getTimeByProjectAndEmp(empid);
  };

  $scope.getTimeByProjectAndEmp = function (empid) {
    console.log('in getTimeByProjectAndEmp');
    factory.getTimebyselected(empid, $scope.currentProject).then(function (response) {
      $scope.allTimeForThisProject = response.data;
      $scope.allTimeForThisProject = $scope.allTimeForThisProject.map(function(index) {
          console.log(index);
          var m = moment(index.date).format('M/D/YY');
          console.log(m);
          for (var i = 0; i < $scope.allEmpsForThisProject.length; i++) {
            console.log('$scope.allEmpsForThisProject', $scope.allEmpsForThisProject);
            if($scope.allEmpsForThisProject[i].empid == index.empid)
            var changeToName = $scope.allEmpsForThisProject[i].empname;
          }
          return ({
              timeid: index.timeid,
              date: m,
              hours: index.hours,
              description: index.description,
              empid: index.empid,
              empname: changeToName
          });//end return
      });//end map
    });//end factory call
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
