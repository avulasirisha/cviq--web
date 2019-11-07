angular.module('Cviq').controller('postNowCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$state','$timeout', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $state, $timeout){

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
    
    $scope.jobData = JSON.parse(localStorage.getItem("JobDetails"));
    console.log("data retrieved",$scope.jobData);
    
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


    if($scope.jobData.certification && $scope.jobData.certification.length == 0){
        $scope.certificates =[];
    }
    if($scope.jobData.certification && $scope.jobData.certification.length != 0){
        $scope.certificates = $scope.jobData.certification.split(',');
    }

   


    $scope.post = function () {
        $rootScope.loading=true;
        
       delete $scope.jobData.date;
       delete $scope.jobData.functionalAreaName;
       delete $scope.jobData.industryName;
      // delete $scope.jobData.areaName;
        console.log($scope.jobData);

        $http({
            method:'POST',
            url: CONSTANT.apiUrl +'/api/recruiter/createJob',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            },
            data:$scope.jobData
        })
            .success(function (response) {
                console.log("response success",response.data);
                bootbox.alert("Job Created Successfully");
                $state.go("home.dashboard.recentlyPostedJobs");
                $rootScope.loading=false;
            })
            .error(function (response) {
                console.log("response error",response);
                bootbox.alert(response.message);
                $rootScope.loading=false;
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }
            })
    }





}]);