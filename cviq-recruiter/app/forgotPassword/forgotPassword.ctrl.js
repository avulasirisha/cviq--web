angular.module('Cviq').controller('forgotPasswordCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state){

    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    /*=============================Start: Forgot Password Function ================================*/

    $scope.forgotPassword = function(){
        console.log($scope.signin.email);
        $rootScope.loading= true;

        $http({
            method:'POST',
            url:CONSTANT.apiUrl + '/api/recruiter/recruiterForgotPassword',
            data:{
                "email": $scope.signin.email
            }
        })
            .success(function (response) {
                $rootScope.loading= false;
                console.log("success", response);
                bootbox.alert(response.message);
                $state.go('home.login');
            })
            .error(function(response){
                $rootScope.loading= false;
                console.log("error", response);
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                    bootbox.alert(response.message);
                }
                else
                bootbox.alert(response.message);
            })
    }

    /*=============================End: Forgot Password Function ================================*/

}]);