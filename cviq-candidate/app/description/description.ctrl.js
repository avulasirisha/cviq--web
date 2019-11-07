angular.module('Cviq').controller('descriptionCtrl', ['$scope','$rootScope','$cookieStore','ngDialog', function($scope, $rootScope, $cookieStore, ngDialog){
    
    $scope.rateLater = function () {
        ngDialog.open({
            template: 'templateId',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    };

}]);