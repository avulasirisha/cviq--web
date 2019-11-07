angular.module('Cviq').controller('changePasswordCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state){

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    /*=============================Start: Change Password Function ================================*/

    $scope.disBtn = false;

    $scope.changePassword = function(data){

        console.log(data);

        $scope.passwords ={
            "oldPassword": data.OldPassword,
            "newPassword": data.NewPassword
        };

        $scope.disBtn = true;

        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/changePassword',
            data:$scope.passwords,
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log(response);
                $scope.disBtn = false;
                bootbox.alert(response.message);
                $state.go('home.dashboard.aggregatedScore',{}, { reload: true });
            })
            .error(function(response){
                console.log(response);
                $scope.disBtn = false;
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: Change Password Function ================================*/

}]);