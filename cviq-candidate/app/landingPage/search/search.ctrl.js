angular.module('Cviq').controller('searchCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$location', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window, $location){

    if($cookieStore.get('AccessToken') != undefined){
        $state.go('home.dashboard.aggregatedScore');
    }

    $scope.applyForJob = function(){
        bootbox.alert('Login first to apply for job');
    }
}]);