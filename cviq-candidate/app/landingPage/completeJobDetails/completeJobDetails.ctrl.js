angular.module('Cviq').controller('completeJobDetailsCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$location', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $location){

    if($cookieStore.get('AccessToken') != undefined){
        $state.go('home.dashboard.aggregatedScore');
    }

    $scope.selJobID = $cookieStore.get('JobID');

    $scope.selectedJobID ={
        jobID:$scope.selJobID
    }

    $http({
        method:'GET',
        url:CONSTANT.apiUrl+'/api/candidate/getSingleJobDetail',
        params:$scope.selectedJobID
    })
        .success(function(response){
            console.log(response);
            $scope.jobData = response.data;
        })
        .error(function(response){
            console.log(response);
        })

    $scope.applyForJob = function(){
        bootbox.alert('Login first to apply for job');
    }


}]);