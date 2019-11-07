angular.module('Cviq').controller('aggragatedCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','$location', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window,$location){

    $rootScope.loading=true;

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }

    
    $scope.fixHeight = false;
   
    $scope.candidateScore = true;

    var candArray =  $location.absUrl().split('+');

    $scope.data = {};
    $scope.data.candidateID = candArray[1];
    console.log("cad id", $scope.data.candidateID);




    $http({
        method:'GET',
        url:CONSTANT.apiUrl + '/api/recruiter/getCandidateAggrScore',
        headers:{
            'authorization': $cookieStore.get('AccessToken'),
        },
        params: $scope.data
    })
        .success(function (response) {
            $rootScope.loading = false;
            console.log("response",response.data);
            
            $scope.candidateAggregatedScore = response.data.candidateAggregatedScore;
            $scope.candidateQualitativeScore = response.data.candidateQualitativeScore;
            $scope.candidateQuantitativeScore = response.data.candidateQuantitativeScore;
            
            $scope.membershipTaken = response.data.membershipTaken;
            $scope.alreadyAlertSent = response.data.alreadyAlertSent;

            $scope.totalAggregatedScore = response.data.totalAggregatedScore;
            $scope.totalQualitativeScore = response.data.totalQualitativeScore;
            $scope.totalQuantitativeScore = response.data.totalQuantitativeScore;

            if( $scope.candidateAggregatedScore == 0){
                $scope.candidateScore = false;

            }
        })
        .error(function (response) {
            console.log("error",response);
            $rootScope.loading = false;
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }

        });


    $scope.sendAlert= function () {
        $('.alertButton').prop('disabled', true);
        $rootScope.loading = true;
        
        
        $http({
            method:'GET',
            url:CONSTANT.apiUrl + '/api/recruiter/sendAlertForScore',
            headers:{
                'authorization': $cookieStore.get('AccessToken'),
            },
            params: $scope.data
        })
            .success(function (response) {
                $('.alertButton').prop('disabled', false);
                $rootScope.loading = false;
                console.log("response",response.data);
                $scope.alreadyAlertSent = true;
                bootbox.alert("Alert Sent");

            })
            .error(function (response) {
                $('.alertButton').prop('disabled', false);
                console.log("error",response);
                $rootScope.loading = false;
                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }

            });



    }

    $scope.payForCandidate= function () {
        $('.alertButton').prop('disabled', true);
        $rootScope.loading = true;
        $http({
            method:'GET',
            url:CONSTANT.apiUrl + '/api/recruiter/getInterviewCharges',
            headers:{
                'authorization': $cookieStore.get('AccessToken'),
            },
            params: { "Id" : $scope.data.candidateID }  
        })
            .success(function (response) {
                $state.go("home.candidateGateway", {"candidate":  $scope.data.candidateID, "Payment": response.data.planRate});
                $('.alertButton').prop('disabled', false);
                $rootScope.loading = false;
                console.log("response",response.data);
            })
            .error(function (response) {
                $rootScope.loading = false;
                $('.alertButton').prop('disabled', false);
                console.log("error",response);
                bootbox.alert(response.message);

                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }

            });
    }
    
    
}]);