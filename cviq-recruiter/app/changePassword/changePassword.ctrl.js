angular.module('Cviq').controller('changePasswordCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','$timeout', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, $timeout){


    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
    
    
    /*=============================Start: Change Password Function ================================*/

    $scope.changePassword = function(data){
        $rootScope.loading=true;

        console.log(data);

        $scope.passwords ={
            "oldPassword": data.OldPassword,
            "newPassword": data.NewPassword
        };


        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/recruiter/recruiterChangePassword',
            data:$scope.passwords,
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log("pass changed",response);
                $rootScope.loading=false;
                $timeout(function(){
                    bootbox.alert(response.message);
                },100);
                $state.go("home.dashboard.recentlyPostedJobs");
            })
            .error(function(response){
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                    $rootScope.loading = false;
                }
                $rootScope.loading=false;
                console.log(response);
                bootbox.alert(response.message);
            })
    }

    /*=============================End: Change Password Function ================================*/

}]);