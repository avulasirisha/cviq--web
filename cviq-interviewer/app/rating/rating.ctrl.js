angular.module('Cviq').controller('ratingCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT', function($scope, $rootScope, $cookieStore, $http, CONSTANT){

    $scope.loading = true;

    if($cookieStore.get('AccessToken') == undefined || $cookieStore.get('AccessToken') == ''){
        $state.go('home.login');
    }

    $scope.number = 5;
    $scope.getNumber = function (num) {
        return new Array(num);
    }

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl+'/api/interviewer/getScorePendingInterviews',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function (response) {
            console.log('Success', response);
            $scope.loading = false;
            $scope.rateLaterData = response.data;
        })
        .error(function (response) {
            console.log('Error', response);
            $scope.loading = false;
            bootbox.alert(response.message);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

}]);