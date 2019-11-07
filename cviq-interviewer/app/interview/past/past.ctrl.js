angular.module('Cviq').controller('pastCtrl', ['$scope','$rootScope','$cookieStore','ngDialog','$http','CONSTANT', function($scope, $rootScope, $cookieStore, ngDialog, $http, CONSTANT){

    if($cookieStore.get('AccessToken') == undefined || $cookieStore.get('AccessToken') == ''){
        $state.go('home.login');
    }

    /*=============================Start: Get past interviews ================================*/

    $scope.pastInterview = function (data) {

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
            url: CONSTANT.apiUrl + '/api/interviewer/getPastInterviewsList',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params: $scope.paginationData
        })
            .success(function(response){
                console.log('Success', response);
                $scope.interviewLists = response.data.interviewList;
                $scope.numberOfInterviews = response.data.totalCount;

                $scope.filteredData = [],
                    $scope.currentPage = data,
                    $scope.numPerPage = 10,
                    $scope.maxSize = 5;

                $scope.$watch('currentPage + numPerPage', function() {
                    $scope.filteredData = $scope.interviewLists.slice(0, 10);
                });

            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }

    /*=============================End: Get past interviews ================================*/

}]);