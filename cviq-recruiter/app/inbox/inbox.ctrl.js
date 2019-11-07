angular.module('Cviq').controller('inboxCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }

    $scope.inbox = true;
    $rootScope.loading = true;


    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/recruiter/fetchInboxMessages',
        headers:{
            'authorization': $cookieStore.get("AccessToken")
        }
    })
        .success(function (response) {
            console.log("response is  ",response.data);
            $scope.inboxArray = response.data;
            $rootScope.loading = false;

        })
        .error(function (response) {
            console.log(response);
            $rootScope.loading=false;
            if(response.statusCode == 401){
                $scope.confirmLogOut();
                bootbox.alert(response.message);
            }
            else
                bootbox.alert(response.message);

        })




}]);