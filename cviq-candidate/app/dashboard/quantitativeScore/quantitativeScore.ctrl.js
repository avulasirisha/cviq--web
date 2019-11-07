angular.module('Cviq').controller('quantitativeScoreCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window){

    $scope.var = $state.params.var;
    console.log($scope.var);

    $http({
        method:'GET',
        url:CONSTANT.apiUrl+'/api/candidate/getQuantitativeScore',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function (response) {
            console.log(response);
            $scope.quantitativeScore = response.data;
        })
        .error(function (response) {
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })


    $scope.curVal = 40;
    $scope.maxVal = 50;
    $scope.loadingCurrent1 = {
        backgroundColor: "#02a9e0"
    }

    $scope.loadingBarStyle1 = {
        backgroundColor: "#d8d8d8"
    }

    $scope.curVal1 = 50;
    $scope.maxVal1 = 50;


}]);