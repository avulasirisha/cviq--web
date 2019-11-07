angular.module('Cviq').controller('aggregatedScoreCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window){

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    console.log($state.params.variable);
    $scope.variable = $state.params.variable;
    $scope.var = $state.params.var;
    console.log($scope.var);

    /*============================= Start: Get aggregated score ================================*/

    $http({
        method:'GET',
        url: CONSTANT.apiUrl +'/api/candidate/getAggregatedScore',
        headers:{
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('aggregated score success', response);
            $scope.candidateScoresObtained = response.data;

            console.log('========================', $scope.candidateScoresObtained.candidateAggregatedScoreArr);

            if($scope.candidateScoresObtained.candidateAggregatedScoreArr != undefined){
                $scope.$emit('GRAPH', {
                    aggregatedScoreResponse : $scope.candidateScoresObtained.candidateAggregatedScoreArr,
                    totalAggScore: $scope.candidateScoresObtained.totalAggregatedScore,
                    candidateAggScore: $scope.candidateScoresObtained.candidateAggregatedScore
                });
            }
        })
        .error(function(response){
            console.log(response);
            if(response.statusCode == 401){
                $rootScope.sessionExpired();
            }
        })

    /*============================= End: Get aggregated score ================================*/
    
    $scope.goToQualitativeScore = function () {
        $state.go('home.dashboard.qualitativeScore.pastInterview',{},{ reload: true});
    }

}]);