angular.module('Cviq').controller('jobDetailsCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','$timeout','$location', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, $timeout, $location){

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }

  //  console.log("job id",$location.absUrl());
    var jobArray =  $location.absUrl().split('+');
//    console.log("job id",jobArray);

    $scope.data = {};
    $scope.data.jobID = jobArray[1];

    $http({
        method : 'GET',
        url : CONSTANT.apiUrl +'/api/recruiter/getJobDetail',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        },
        params: $scope.data,
    })
        .success(function (response) {
            console.log("job is",response.data);
            $scope.jobData = response.data;

            if($scope.jobData.workExperience.min == 15){
                $scope.workEx = 'More than 15 Years'
            }
            else {
                $scope.workEx = $scope.jobData.workExperience.min +" - " + $scope.jobData.workExperience.max + " Years";
            }

            if($scope.jobData.annualCompensation.min == 50000){
                $scope.salary = 'More than $50000'
            }
            else {
                $scope.salary = '$' + $scope.jobData.annualCompensation.min +" to " + '$' + $scope.jobData.annualCompensation.max ;
            }

            $scope.education = $scope.jobData.underGraduate ;
            if($scope.jobData.postGraduate){

                $scope.education =  $scope.education +' , ' + $scope.jobData.postGraduate;
            }

            if($scope.jobData.certification.length == 0){
                $scope.certificates =[];
            }
            else{
                $scope.certificates = $scope.jobData.certification.split(',');
            }
            
            console.log("certi length",$scope.certificates.length);

        })
        .error(function (response) {
            console.log("error",response);
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }
            bootbox.alert(response.message);
        })





}]);