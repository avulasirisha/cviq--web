angular.module('Cviq').controller('contactusCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','characterService','$state', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, characterService, $state){

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }
    //else{
    //    $state.go('home.dashboard.aggregatedScore');
    //}
      $scope.contact= {};
      $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));
      
      $scope.contact.email =  $scope.userData.email;

    /*=============================End: Submit Profile Data ================================*/

   $scope.contactusSubmit = function(data){

        var contactData = {};

       
        contactData.subject = data.subject;
        contactData.description = data.description ;
        contactData.email = data.email;
        contactData.userType = "CANDIDATE" ;

        $http({
            method:'POST',
            url: CONSTANT.apiUrl +'/api/common/contactus',
            data:contactData,
            headers:{
                authorization: $cookieStore.get('AccessToken'),
            }
        })
            .success(function(response){
                console.log(response);
                $rootScope.loading = false;
                bootbox.alert('On Of Our CVIQ Admin Contact You Shortly.');
                $state.go('home.dashboard.aggregatedScore');
                $rootScope.scrollToTop();
                $timeout(function () {
                    $state.go('home.dashboard.aggregatedScore');
                },500);

            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

}]);
