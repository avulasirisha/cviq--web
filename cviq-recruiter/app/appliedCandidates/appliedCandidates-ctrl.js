angular.module('Cviq').controller('appliedCandidatescntrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','$timeout','$location', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, $timeout, $location){

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }

  //  console.log("job id",$location.absUrl());
    var jobArray =  $location.absUrl().split('+');
    //    console.log("job id",jobArray);
    $scope.data = {};
    $scope.data.jobID = jobArray[1];
    $scope.noRecentJob = false;

    $http({
        method : 'GET',
        url : CONSTANT.apiUrl + '/api/recruiter/getappliedCandidates',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        },
        params :$scope.data
    })
        .success(function (response) {
            console.log("response",response.data)
            $scope.searchResult = response.data;
            console.log("length",$scope.searchResult.length)
            if($scope.searchResult.length == 0)
                $scope.nocandidates = true;

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





}]);