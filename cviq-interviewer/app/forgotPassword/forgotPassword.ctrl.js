angular.module('Cviq').controller('forgotPasswordCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state){

    $scope.myregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    /*=============================Start: Forgot Password Function ================================*/

    $scope.forgotPassword = function(){
        $scope.loading = true;
        console.log($scope.signin.email);

        $http({
            method:'POST',
            url:CONSTANT.apiUrl + '/api/interviewer/interviewerForgotPassword',
            data:{
                "email": $scope.signin.email
            }
        })
            .success(function (response) {
                $scope.loading = false;
                console.log("success", response);
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