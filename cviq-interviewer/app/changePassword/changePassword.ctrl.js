angular.module('Cviq').controller('changePasswordCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state){

    /*=============================Start: Change Password Function ================================*/

    $scope.changePassword = function(data){

        console.log(data);

        $scope.passwords ={
            "oldPassword": data.OldPassword,
            "newPassword": data.NewPassword
        };


        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/interviewer/interviewerChangePassword',
            data:$scope.passwords,
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log(response);
                bootbox.alert(response.message);
                $state.go('home.dashboard');
            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Change Password Function ================================*/

}]);