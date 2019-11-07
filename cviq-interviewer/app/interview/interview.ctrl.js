angular.module('Cviq').controller('interviewCtrl', ['$scope','$rootScope','ngDialog','$state', function($scope, $rootScope, ngDialog, $state){

    $scope.var1 = $state.params.var1;

    $scope.number = 5;
    $scope.getNumber = function (num) {
        return new Array(num);
    }

}]);