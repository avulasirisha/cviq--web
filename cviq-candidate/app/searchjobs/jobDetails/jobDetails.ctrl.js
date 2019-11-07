angular.module('Cviq').controller('jobDetailsCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    /*=============================Start: Get complete job details ================================*/

    $scope.selJobID = $cookieStore.get('JobID');
    
    $scope.selectedJobID ={
        jobID:$scope.selJobID
    }

    $http({
        method:'GET',
        url:CONSTANT.apiUrl+'/api/candidate/getSingleJobDetail',
        params:$scope.selectedJobID,
        headers: {
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('job data auto', response);
            $scope.jobData = response.data;
            $scope.jobData.keySkills = response.data.keySkills.toString();
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }else if(response.statusCode == 400 ){
               bootbox.alert(response.message);  
                $timeout(function(){
                        $state.go('home.search.searchJobs');
                }, 0);

            }
        })

    /*=============================End: Get complete job details ================================*/

    /*=============================Start: Apply for job ================================*/

    $scope.disLink = false;

    $scope.applyForJob = function(data){

        $scope.disLink = true;

            var d = new Date();
            var timeZoneOffset = d.getTimezoneOffset();

            $http({
                method: 'POST',
                url: CONSTANT.apiUrl + '/api/candidate/applyForJob',
                headers: {
                    authorization: $cookieStore.get('AccessToken')
                },
                data: {
                    "jobID": data,
                    "timeOffset": timeZoneOffset
                }
            })
                .success(function(response){
                    console.log(response);
                    bootbox.alert(response.message);
                    $scope.disLink = false;
                    $timeout(function(){
                        $state.reload('home.search.jobDetails');
                    }, 0);

                })
                .error(function(response){
                    console.log(response);
                    bootbox.alert(response.message);
                    $scope.disLink = false;
                    if(response.statusCode == 401){
                        $rootScope.sessionExpired();
                    }
                })

    }

    /*=============================End: Apply for job ================================*/


    /*=============================Start: Get Recently Searched Jobs ================================*/

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/candidate/recentlySearchedJobs',
        headers: {
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('data', response);
            $scope.recentlysearchedJobs = response.data;
        })
        .error(function(response){
            console.log(response);
        })

    /*=============================End: Get Recently Searched Jobs ================================*/


    $scope.jobDetails = function(response){     
        $cookieStore.put('JobID', response);     

            $timeout(function(){
                $state.reload('home.search.jobDetails');
            }, 0);
            $rootScope.scrollToTop();
    
            $state.go('home.search.jobDetails');
    }


}]);