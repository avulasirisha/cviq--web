angular.module('Cviq').controller('desiredJobCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

    $scope.desiredJobData = JSON.parse(localStorage.getItem('UserDetails')).desiredJob;
    console.log($scope.desiredJobData);

    $scope.read = true;
    
    $scope.editDesiredJobData = function () {
        $scope.read = false;
        $('.candidate-edit-profile input.inp').css("background", "#e9ecee");
    }
    
    $scope.cancelDetails = function () {
        $scope.read = true;
        $('.candidate-edit-profile input.inp').css("background", "none");
    }

    /*=============================Start: Update desired job data ================================*/

    $scope.editDesiredDetails = function (data) {
        console.log(data);

        var desiredJobObject = {
            "jobLocation": data.jobLocation,
            "industry": data.industry,
            "functionalArea": data.functionalArea,
            "salary": data.salary
        };

        $http({
            method:'PUT',
            url: CONSTANT.apiUrl +'/api/candidate/editDesiredJobData',
            data:desiredJobObject,
            headers:{
                authorization:$cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log(response);
                localStorage.setItem('UserDetails',JSON.stringify(response.data));
                $state.reload('home.inbox.desiredJob');
                bootbox.alert(response.message);
            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }    

    /*=============================End: Update desired job data ================================*/

}]);