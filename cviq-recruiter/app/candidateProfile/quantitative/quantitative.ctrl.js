angular.module('Cviq').controller('quantitativeCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','$location', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window,$location){

     $rootScope.loading=true;

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }


    var candArray =  $location.absUrl().split('+');

    $scope.data = {};
    $scope.data.candidateID = candArray[1];
    console.log("cad id", $scope.data.candidateID);

    $scope.fixHeight = false;
    $scope.maxQuantitative = {};
    $scope.candidateQuantitative = {};


    
   $http({
       method:'GET',
       url:CONSTANT.apiUrl + '/api/recruiter/getCandidateQuantScore',
       headers:{
           'authorization': $cookieStore.get('AccessToken'),
       },
       params: $scope.data,
   })
       .success(function (response) {
           $rootScope.loading = false;
           console.log("response",response.data);

           $scope.maxQuantitative.totalQuantitativeScore = response.data.totalQuantitativeScore;
           $scope.maxQuantitative.totalExperiencePoints = response.data.totalExperiencePoints;
           $scope.maxQuantitative.totalEducationPoints = response.data.totalEducationPoints;
           $scope.maxQuantitative.totalCertificationPoints = response.data.totalCertificationPoints;
           $scope.maxQuantitative.totalAwardPoints = response.data.totalAwardPoints;
           $scope.maxQuantitative.totalPatentPoints = response.data.totalPatentPoints;




           $scope.candidateQuantitative.candidateQuantitativeScore = response.data.candidateQuantitativeScore;
           $scope.candidateQuantitative.candidateExperiencePoints = response.data.candidateExperiencePoints;
           $scope.candidateQuantitative.candidateEducationPoints = response.data.candidateEducationPoints;
           $scope.candidateQuantitative.candidateCertificationPoints = response.data.candidateCertificationPoints;
           $scope.candidateQuantitative.candidateAwardPoints = response.data.candidateAwardPoints;
           $scope.candidateQuantitative.candidatePatentPoints = response.data.candidatePatentPoints;



       })
       .error(function (response) {
           console.log("error",response);
           $rootScope.loading = false;
           if(response.statusCode == 401){
               $scope.confirmLogOut();
           }

       })


}]);