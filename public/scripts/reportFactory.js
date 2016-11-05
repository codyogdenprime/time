myApp.factory('reportFactory', ['$http', function($http) {
    console.log('in reportFactory');

    var idToken = sessionStorage.getItem('userAuth');

    //gets reports for users with date search
    var getUserReports = function(empid, projectId, sDate, eDate) {
        return $http({
            method: 'GET',
            url: 'api/reports/date/?empid='+ empid +'&projectId=' + projectId + '&sDate=' + sDate + '&eDate=' + eDate,
            headers: {
                id_token: idToken
            }
        }); //end http
    }; //end get reports

    //get reports if no emp id selected
    var getReportsNoEmpId = function(projectId, sDate, eDate){
      return $http({
        method: 'GET',
        url: 'api/reports/adminNoEmp/?projectId=' + projectId  +'&sDate=' + sDate + '&eDate=' + eDate,
        headers: {
          id_token: idToken
        }
      });
  };//get Admin Reports

    //get reports for admin
    var getAdminReports = function(project_Id,empId,s_Date,e_Date){
        return $http({
          method: 'GET',
          url: 'api/reports/admin/?projectId=' + project_Id + '&empId='+ empId +'&sDate=' + s_Date + '&eDate=' + e_Date,
          headers: {
            id_token: idToken
          }
        });
    };//get Admin Reports

    //get reports by Project id
    var getReportsByProject = function(projectId) {
        return $http({
            method: 'GET',
            url: 'api/reports/?projectId=' + projectId,
            headers: {
                id_token: idToken
            }
        }); //end http
    }; //end get reports

    //get all Projects(and those Projects time) based on Client
    var getAllbyClient = function(clientid){
      return $http({
        method: 'GET',
        url: '/api/reports/all/?clientid=' + clientid,
        headers: {
          id_token: idToken
        }
      });
    };

    //get all time for currently logged in user
    var getAllEmp = function(empid){
      return $http({
        method: 'GET',
        url: 'api/time/getAllEmp/?empid=' + empid,
        headers: {
          id_token: idToken
        }
      });
    };//end get all empp

    var getAllByDate = function(emp_id,s_Date,e_Date){
      return $http({
        method: 'GET',
        url: 'api/reports/allTime/?emp_id=' + emp_id + '&s_Date=' + s_Date + '&e_Date='+ e_Date,
        headers: {
          id_token: idToken
        }
      });
    };

    return{
      getUserReports: getUserReports,
      getAdminReports: getAdminReports,
      getReportsNoEmpId: getReportsNoEmpId,
      getReportsByProject: getReportsByProject,
      getAllbyClient: getAllbyClient,
      getAllEmp: getAllEmp,
      getAllByDate: getAllByDate
    };//end return

}]);
