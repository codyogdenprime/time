myApp.constant('moment', moment);
myApp.controller('reportsController', ['factory', 'authFactory', 'reportFactory', '$scope', '$http', '$location', '$window',function(factory, authFactory, reportFactory, $scope, $http, $location, $window) {
    console.log('in reportsController');

    //global arrays
    $scope.allClients = [];
    $scope.allClientProjects = [];
    $scope.usersOnProject = [];
    $scope.reports = [];
    $scope.userProjects = [];


    //get user status
    var userProfile = authFactory.get_user();
    console.log(userProfile.isadmin);
    var userUID = sessionStorage.getItem('userGoogleId');
    var userDisplayName = sessionStorage.getItem('userDisplayName');
    var userPhotoURL = sessionStorage.getItem('userPhotoUrl');

    //display date pickers for start and end dates
    $(function() {
        $("#datepickerStart").datepicker({
            "dataformat": "yy-mm-dd"
        });
    });
    $(function() {
        $("#datepickerEnd").datepicker({
            "dataformat": "yy-mm-dd"
        });
    });

    // get all clients
    $scope.init = function() {
        factory.getAllClients().then(function(results) {
            console.log(results.data, 'ALL CLIENTS');
            $scope.allClients = results.data;
        }); //get all clients
        if (userProfile.isadmin === false) {
            var empid = userProfile.empid;
            factory.getUserProjects(empid).then(function(results) {
                console.log(results, 'if not admin get projects for current user');
                $scope.userProjects = results.data;
            }); //end factory get user projects
        } //end if
        $scope.userStatus();
    }; //end scope dot init

    $scope.searchAllClient = function(selectedClient) {
      if ($("#datepickerStart").val() === "" && $("#datepickerEnd").val() === "") {
      console.log('search all client');
        var clientid = $scope.selectedClient.clientid;
        reportFactory.getAllbyClient(clientid).then(function(results) {
            console.log(results.data, 'all proj results');
            $scope.reports = results.data;
            $scope.reports = $scope.reports.map(function(index) {
                var m = moment(index.date).format('M/D/YY');
                return ({
                    timeid: index.timeid,
                    date: m,
                    hours: index.hours,
                    description: index.description,
                    empid: index.empid
                });
              });
            $scope.addHours();
        }); //end factory
      }else {
        var clientid = $scope.selectedClient.clientid;
        var sDate = moment($('#datepickerStart').val()).format('M/D/YY');
        var eDate = moment($('#datepickerEnd').val()).format('M/D/YY');
        reportFactory.getAllByClientDate(clientid,sDate,eDate).then(function(results) {
            console.log(results.data, 'all proj results');
            $scope.reports = results.data;
            $scope.reports = $scope.reports.map(function(index) {
                var m = moment(index.date).format('M/D/YY');
                return ({
                    timeid: index.timeid,
                    date: m,
                    hours: index.hours,
                    description: index.description,
                    empid: index.empid
                });
              });
            $scope.addHours();
        }); //end factory
      }
    }; //end search all client

    //get all time reports for currently logged in user
    $scope.getAllUserTime = function() {
        var empid = userProfile.empid;
        reportFactory.getAllEmp(empid).then(function(results) {
            console.log(results.data);
            $scope.reports = results.data;
        }); //end factory
    }; //end get all user time

    //get all projects based on selected client from above function
    $scope.client = function(selectedClient) {
        var clientid = $scope.selectedClient.clientid;
        factory.getClientProjects(clientid).then(function(results) {
            console.log(results.data);
            $scope.allClientProjects = results.data;
        }); //end get client projects by client_id
    }; //end scope dot client


    //*********** this should only show if admin = true ************************
    //get user for project selected from above function
    $scope.project = function(selectedProject) {
        var projectId = $scope.selectedProject.projectid;
        factory.getProjectUsers(projectId).then(function(results) {
            console.log(results.data);
            $scope.usersOnProject = results.data;
        }); //end get project users
    }; //end scope people on project

    //this gets project
    $scope.userProject = function(selUserProject) {
        var selProjectid = $scope.selUserProject.projectid;
        console.log(selProjectid, 'reportsssssss');
    }; //end user project

    //get selected user from DOM
    $scope.user = function(selectedUser) {
        if ($scope.selectedUser.empid !== null) {
            var empId = $scope.selectedUser.empid;
            console.log(empId);
        }
    }; //end get selected user

    //search by date and projectId for user
    $scope.searchByDateUser = function() {
      if ($scope.selUserProject == null) {
        console.log('if all time empty');
        var emp_id = userProfile.empid;
        var s_Date = moment($('#datepickerStart').val()).format('M/D/YY');
        var e_Date = moment($('#datepickerEnd').val()).format('M/D/YY');
        reportFactory.getAllByDate(emp_id,s_Date, e_Date).then(function(results){
          console.log(results.data, 'search by date ALL!');
          $scope.reports = results.data;
          $scope.addHours();
        });
      }else{
        console.log(userProfile);
        console.log('else all time full');
        var empid = userProfile.empid;
        var projectId = $scope.selUserProject.projectid;
        var sDate = moment($('#datepickerStart').val()).format('M/D/YY');
        var eDate = moment($('#datepickerEnd').val()).format('M/D/YY');
        reportFactory.getUserReports(empid, projectId, sDate, eDate).then(function(results) {
            console.log(results.data, 'date search results');
            $scope.reports = results.data;
            $scope.addHours();
        });
      }
    }; //end searchByDate user

    //search by date for admin
    $scope.searchByDateAdmin = function() {
      if ($scope.selectedProject == null) {
        $scope.searchAllClient();
      }
        if ($scope.selectedUser == null) {
            console.log('undefined');
            var projectId = $scope.selectedProject.projectid;
            var sDate = moment($('#datepickerStart').val()).format('M/D/YY');
            var eDate = moment($('#datepickerEnd').val()).format('M/D/YY');
            reportFactory.getReportsNoEmpId(projectId, sDate, eDate).then(function(results) {
                console.log(results.data, 'date search results');
                $scope.reports = results.data;
                $scope.addHours();
            }); //end factory
        } else {
            console.log('defined');
            var empId = $scope.selectedUser.empid;
            var project_Id = $scope.selectedProject.projectid;
            var s_Date = moment($('#datepickerStart').val()).format('M/D/YY');
            var e_Date = moment($('#datepickerEnd').val()).format('M/D/YY');
            reportFactory.getAdminReports(project_Id, empId, s_Date, e_Date).then(function(results) {
                console.log(results.data, 'date search results');
                $scope.reports = results.data;
                $scope.addHours();
            }); //end factorty get
        } //end else
    }; //search by date admin

    ///this gets projects based on currently logged in user
    $scope.currentUserProjects = function() {
        var empId = userUID;
        if ($scope.selUserProject !== null) {
        var projId = $scope.selUserProject.projectid;
        factory.getMyTimeForThisProject(empId, projId).then(function(results) {
            console.log(results.data);
            $scope.reports = results.data;
            $scope.reports = $scope.reports.map(function(index) {
                var m = moment(index.date).format('M/D/YY');
                return ({
                    timeid: index.timeid,
                    date: m,
                    hours: index.hours,
                    description: index.description,
                    empid: index.empid
                });
            });
            $scope.addHours();
        }); //end factory get
      }else {
        $scope.getAllUserTime();
      }
    }; //end get current user Projects

    //this will get reports for selected user from drop down list -- only for admins
    $scope.getAllUserInfo = function() {
        var projid = $scope.selectedProject.projectid;
        var empid = $scope.selectedUser.empid;
        factory.getTimebyselected(empid, projid).then(function(results) {
            console.log(results.data);
            $scope.reports = results.data;
            $scope.reports = $scope.reports.map(function(index) {
                var m = moment(index.date).format('M/D/YY');
                return ({
                    timeid: index.timeid,
                    date: m,
                    hours: index.hours,
                    description: index.description,
                    empid: index.empid
                });
            });
            $scope.addHours();
        }); //end factory get
    }; //end get all User info

    //run report functions
    $scope.runReport = function() {
        if (userProfile.isadmin === true) {
            if ($("#datepickerStart").val() === "" && $("#datepickerEnd").val() === "") {

                $scope.srcByProject();
                $scope.getAllUserInfo();
            } else {
                $scope.searchByDateAdmin();
            } //end date picker empty if
        } else {
            if ($("#datepickerStart").val() === "" && $("#datepickerEnd").val() === "") {
                $scope.currentUserProjects();
            } else {
                $scope.searchByDateUser();
            }

        }
    }; //end run report

    //search for all times on a project - only for admin
    $scope.srcByProject = function() {
      if ($scope.selectedProject == null) {
        $scope.searchAllClient();
      }else {
      console.log('search by project');
        var projId = $scope.selectedProject.projectid;
        factory.getTimeByProj(projId).then(function(results) {
            console.log(results.data);
            $scope.reports = results.data;
            $scope.reports = $scope.reports.map(function(index) {
                var m = moment(index.date).format('M/D/YY');
                return ({
                    timeid: index.timeid,
                    date: m,
                    hours: index.hours,
                    description: index.description,
                    empid: index.empid
                });
            });
            $scope.addHours();
        }); //end factory
        }
    }; //end scope src by project

    // what to display for admin or user
    $scope.userStatus = function() {
        //if user is  admin hide
        if (userProfile.isadmin === true) {
            $scope.selectEmp = false;
            $scope.clientSelect = false;
            $scope.actionBtn = false;
        } else {
            //if user IS NOT admin show forms
            $scope.selectEmp = true;
            $scope.actionBtn = true;
            $scope.clientSelect = true;
        } //end else
    }; //end scope.userStatus

    //add all hours worked and display
    $scope.addHours = function() {
        $scope.addAllHours = 0;
        for (var i = 0; i < $scope.reports.length; i++) {
            $scope.addAllHours += Number($scope.reports[i].hours);
        } //end for loop
    }; //scope add hours

    $scope.deleteTime = function(timeId) {
        $window.alert('Are you sure?');
        console.log(timeId);
        console.log($scope.reports);
        factory.deleteTimeEntry(timeId).then(function(results) {
            console.log(results, 'delete results');
            $window.alert(results.data.success);
        });
        $window.location.reload();
    };

    //this exports to CSV! see html for more
    $scope.exportCSV = function() {
        var myStyle = {
            headers: true,
            quotes: false
        };
        var data = $scope.reports;
        //if admin use these file names
        if (userProfile.isadmin === true) {
            var projectName = $scope.selectedProject.projectname;
            var filename = projectName.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with dash, force lowercase
            alasql.promise('SELECT * INTO XLSX("' + filename + '-hours.xlsx", ?)FROM ?', [myStyle, data])
                .then(function() {
                    console.log('DATA SAVED');
                }).catch(function(err) {
                    console.log('ERROR', err);
                }); //end catch
        } else {
            //if user use these file names
            var project_Name = $scope.selUserProject.projectname; // Project Name from Scope
            // var user_name = userProfile.empname;
            var file_name = project_Name.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with dash, force lowercase
            alasql.promise('SELECT * INTO XLSX("' + file_name + '-hours.xlsx", ?)FROM ?', [myStyle, data])
                .then(function() {
                    console.log('DATA SAVED');
                }).catch(function(err) {
                    console.log('ERROR', err);
                }); //end catch
        } //end else
    }; //end scope
    $scope.init();
}]);
