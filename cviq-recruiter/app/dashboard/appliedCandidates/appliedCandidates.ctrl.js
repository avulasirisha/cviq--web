angular.module('Cviq').controller('appliedCandidatesCtrl', ['ngDialog','$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window', function(ngDialog, $scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window){

    $rootScope.loading=true;

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
    $scope.fixHeight = false;
    console.log("favouriteCandidates");



    $http({
        method : 'GET',
        url : CONSTANT.apiUrl + '/api/recruiter/getappliedCandidateList',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function (response) {
            console.log("favourite candidates",response)

            $scope.favourite = response.data;
            if($scope.favourite.length == 0)
                $scope.nofavourite = true;
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



    /*============================= Start : Favourite candidate API=================================*/



    /*============================= End : Favourite candidate API=================================*/
    
    
    
}]);