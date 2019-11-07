angular.module('Cviq').controller('viewedProfileCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

    /*=============================Start: Who viewed candidate profile ================================*/

    $scope.pageFunction = function (data) {

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
            url: CONSTANT.apiUrl + '/api/candidate/getProfileVisitedByList',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params: $scope.paginationData
        })
            .success(function(response){
                console.log('Success Visit', response);
                $scope.whoViewedProfile = response.data.recruiterList;
                $scope.numberOFJobs = response.data.totalCount;

                $scope.filteredData = [],
                    $scope.currentPage = data,
                    $scope.numPerPage = 10,
                    $scope.maxSize = 5;

                $scope.$watch('currentPage + numPerPage', function() {
                    $scope.filteredData = $scope.whoViewedProfile.slice(0, 10);
                });

            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }
    /*=============================End: Who viewed candidate profile ================================*/


    /*=============================Start: Get recruiter details ================================*/

    $scope.recruiterDetails = function(response){
        localStorage.setItem('RecruiterDetails', JSON.stringify(response));
        $state.go('home.inbox.recruiterDetails');
        $rootScope.scrollToTop();
    }

    /*=============================End: Get recruiter details ================================*/

}]);