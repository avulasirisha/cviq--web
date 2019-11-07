angular.module('Cviq').controller('faqCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT', function($scope, $rootScope, $cookieStore, $http, CONSTANT){

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/admin/getFAQList',
        params: {
            userType:"CANDIDATE"
        }
    })
        .success(function(response){
            console.log('Success', response);
            $scope.allFaq = response.data;
        })
        .error(function(response){
            console.log(response);
            bootbox.alert(response.message);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

}]);