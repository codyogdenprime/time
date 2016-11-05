myApp.factory('reportFactory', ['$http', function($http) {
    console.log('in reportFactory');

    var idToken = sessionStorage.getItem('userAuth');

    //gets reports for users with date search
    var getUserReports = function(projectId, sDate, eDate) {
        return $http({
            method: 'GET',
            url: 'api/reports/date/?projectId=' + projectId + '&sDate=' + sDate + '&eDate=' + eDate,
            headers: {
                id_token: idToken
            }
        }); //end http
    }; //end get reports

    var getReportsNoEmpId = function(projectId, sDate, eDate){
      return $http({
        method: 'GET',
        url: 'api/reports/adminNoEmp/?projectId=' + projectId  +'&sDate=' + sDate + '&eDate=' + eDate,
        headers: {
          id_token: idToken
        }
      });
  };//get Admin Reports

    var getAdminReports = function(project_Id,empId,s_Date,e_Date){
        return $http({
          method: 'GET',
          url: 'api/reports/admin/?projectId=' + project_Id + '&empId='+ empId +'&sDate=' + s_Date + '&eDate=' + e_Date,
          headers: {
            id_token: idToken
          }
        });
    };//get Admin Reports

    var getReportsByProject = function(projectId) {
        return $http({
            method: 'GET',
            url: 'api/reports/?projectId=' + projectId,
            headers: {
                id_token: idToken
            }
        }); //end http
    }; //end get reports

    return{
      getUserReports: getUserReports,
      getAdminReports: getAdminReports,
      getReportsNoEmpId: getReportsNoEmpId,
      getReportsByProject: getReportsByProject
    };//end return

}]);
