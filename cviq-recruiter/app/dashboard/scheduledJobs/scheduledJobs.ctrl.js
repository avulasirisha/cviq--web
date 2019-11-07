angular.module('Cviq').controller('scheduledJobsCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window){

    $rootScope.loading=true;
    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
    $scope.fixHeight = false;
    
console.log("scheduled jobs");
    $scope.noScheduledJob = false;

    $http({
        method : 'GET',
        url : CONSTANT.apiUrl + '/api/recruiter/getScheduledJobs',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function (response) {
            console.log("response",response.data)

            $scope.scheduled = response.data;
            if($scope.scheduled.length == 0)
                $scope.noScheduledJob = true;

            $rootScope.loading=false;
            $scope.fixHeight = true;
        })
        .error(function (response) {
            console.log("response",response)
            $rootScope.loading=false;
            $scope.fixHeight = true;
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }
        });





    

//===================to view job details under the job =======================================================
/*
        $scope.showDetails = function (index) {

        var v = "#showJobDetails-"+index;
        console.log("class toggled")
        $(v).toggleClass('showdetails hidedetails');
        var v1 = "#hideJobDetailsbtn2-"+index;

        $(v1).toggleClass('showdetails hidedetails');

        var v2 = "#showJobDetailsbtn2-"+index;
        $(v2).toggleClass('showdetails hidedetails');
        
        
    };

    $scope.hideDetails = function (index) {

        var v = "#showJobDetails-"+index;
        console.log("class toggled")
        $(v).toggleClass('showdetails hidedetails');

        var v1 = "#hideJobDetailsbtn2-"+index;

        $(v1).toggleClass('showdetails hidedetails');

        var v2 = "#showJobDetailsbtn2-"+index;
        $(v2).toggleClass('showdetails hidedetails');
    };
    */
    
    
    
    
    
}]);