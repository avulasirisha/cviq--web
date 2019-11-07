angular.module('Cviq').controller('alertsCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

    if($cookieStore.get('AccessToken') == undefined || $cookieStore.get('AccessToken') == ''){
        $state.go('home.login');
    }

    /*=============================Start: Get past interviews ================================*/

    $scope.alerts = function (data) {

        $scope.paginationData = {
            start:0,
            limit:10
        }
        console.log('page number', data);

        if(data && data > 1) {
            $scope.paginationData.start = (data-1) * $scope.paginationData.limit;
            console.log('page number1111', $scope.paginationData.start);
        }

        $http({
            method: 'GET',
            url: CONSTANT.apiUrl + '/api/candidate/getAllNotificationAlerts',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params: $scope.paginationData
        })
            .success(function(response){
                console.log('Alerts Success', response);

                    $scope.alertLists = response.data.alertList;
                    $rootScope.numberOFAlerts = response.data.totalCount;

                    $scope.filteredData = [],
                        $scope.currentPage = data,
                        $scope.numPerPage = 10,
                        $scope.maxSize = 5;

                    $scope.$watch('currentPage + numPerPage', function() {
                        $scope.filteredData = $scope.alertLists.slice(0, 10);
                    });
            })
            .error(function(response){
                console.log(response);
            })

    }

    /*=============================End: Get past interviews ================================*/


}]);