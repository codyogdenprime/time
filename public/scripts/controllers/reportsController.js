myApp.controller('reportsController', ['authFactory', 'factory', '$scope', '$http', '$location', function(factory, $scope, $http, $location, authFactory) {
            console.log('in reportsController');

            // get all clients
            $scope.init = function(){
                    factory.getClients().then(function(results) {
                        console.log(results, 'Clients');
                    });
                };
                
                // get all projects
                //

                //this exports to CSV! see html for more
                $scope.exportCSV = function() {
                    factory.getAllEmployees().then(function(results) {
                        console.log(results.data, 'employees for CSVVVVVV');
                        var data = results.data;
                        alasql.promise('SELECT * INTO XLSX("my4.xlsx", {headers:TRUE, quote:FALSE})FROM ?', [data])
                            .then(function() {
                                console.log('DATA SAVED');
                            }).catch(function(err) {
                                console.log('ERROR', err);
                            }); //end catch
                    }); //end factory
                }; //end scope

                $scope.init();
            }]);
