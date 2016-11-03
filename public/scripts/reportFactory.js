myApp.factory('reportFactory', ['$http', function($http) {
    console.log('in reportFactory');

    var idToken = sessionStorage.getItem('userAuth');
    //gets reports for users with date search
    var getReports = function(projectId, sDate, eDate) {
        return $http({
            method: 'GET',
            url: 'api/reports/date/?projectId=' + projectId + '&sDate=' + sDate + '&eDate=' + eDate,
            headers: {
                id_token: idToken
            }
        }); //end http
    }; //end get reports

    var getAdminReports = function(projectId,empId,sDate,eDate){
        return $http({
          method: 'GET',
          url: 'api/reports/admin/?projectId=' + projectId + '&empId='+ empId +'&sDate=' + sDate + '&eDate=' + eDate,
          headers: {
            id_token: idToken
          }
        });
    };//get Admin Reports





    return{
      getRports: getReports,
      getAdminReports: getAdminReports
    };//end return

}]);
