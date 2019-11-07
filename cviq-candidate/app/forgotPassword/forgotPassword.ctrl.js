angular.module('Cviq').controller('forgotPasswordCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state){

    //$scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    $scope.myregex = "^(([\\w-]+\\.)+[\\w-]+|([a-zA-Z]{1}|[\\w-]{2,}))@"
        + "((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?"
        + "[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\."
        + "([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\\.([0-1]?"
        + "[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|"
        + "([a-zA-Z]+[\\w-]+\\.)+[a-zA-Z]{2,4})$";

    /*=============================Start: Forgot Password Function ================================*/

    $scope.forgotPassword = function(){
        $scope.loading = true;
        console.log($scope.signin.email);

        $http({
            method:'POST',
            url:CONSTANT.apiUrl + '/api/candidate/forgotPassword',
            data:{
                "email": $scope.signin.email
            }
        })
            .success(function (response) {
                console.log("success", response);
                $scope.loading = false;
                bootbox.alert(response.message);
                $state.go('home.login');
            })
            .error(function(response){
                $scope.loading = false;
                console.log("error", response);
                bootbox.alert(response.message);
            })
    }

    /*=============================End: Forgot Password Function ================================*/

}]);