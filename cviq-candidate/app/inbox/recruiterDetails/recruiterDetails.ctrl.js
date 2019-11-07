angular.module('Cviq').controller('recruiterDetailsCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$stateParams', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $stateParams){

    $scope.recruiterData = JSON.parse(localStorage.getItem('RecruiterDetails'));
    console.log('$scope.recruiterData', $scope.recruiterData);

    $http({
        method: 'PUT',
        url: CONSTANT.apiUrl + '/api/candidate/updateProfileVisitCount',
        headers: {
            authorization: $cookieStore.get('AccessToken')
        },
        data:{
            "recruiterID": $scope.recruiterData._id
        }
    })
        .success(function(response){
            console.log('Success Visit', response);
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

}]);