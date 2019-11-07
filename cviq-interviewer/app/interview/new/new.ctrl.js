angular.module('Cviq').controller('newCtrl', ['$scope','$rootScope','$cookieStore','ngDialog','$http','CONSTANT','$state', function($scope, $rootScope, $cookieStore, ngDialog, $http, CONSTANT, $state){

    if($cookieStore.get('AccessToken') == undefined || $cookieStore.get('AccessToken') == ''){
        $state.go('home.login');
    }

    /*=============================Start: Get new interviews ================================*/

    $scope.newInterview = function (data) {

        $scope.paginationData = {
            start:0,
            limit:10
        }
        console.log('page number', data);

        if(data && data > 1) {
            $scope.paginationData.start = (data-1) * $scope.paginationData.limit;
            console.log('page number1111', $scope.paginationData.start);
        }

        $http({
            method: 'GET',
            url: CONSTANT.apiUrl + '/api/interviewer/getNewInterviewsList',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params: $scope.paginationData
        })
            .success(function(response){
                console.log('Success', response);
                $scope.interviewLists = response.data.interviewList;
                $scope.numberOfInterviews = response.data.totalCount;

                $scope.filteredData = [],
                    $scope.currentPage = data,
                    $scope.numPerPage = 10,
                    $scope.maxSize = 5;

                $scope.$watch('currentPage + numPerPage', function() {
                    $scope.filteredData = $scope.interviewLists.slice(0, 10);
                });

            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
            })

    }

    /*=============================End: Get new interviews ================================*/


    /*=============================Start: accept or decline interview ================================*/
    
    $scope.acceptInterview = function (data) {

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/interviewer/acceptDeclineNewRequest',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
                "interviewID": data,
                "interviewerResponse": true
            }
        })
            .success(function(response){
                console.log('Success', response);
                bootbox.alert("Interview request has been accepted.");
                $state.reload('home.interview.new');

            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    $scope.declineInterview = function () {
    
        if( ($scope.message.message == undefined || $scope.message.message.length < 2)&& $scope.message.attachment == undefined ){
            $scope.messageModalError = true;
        }else{

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/interviewer/acceptDeclineNewRequest',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
                "interviewID": $scope.message.interviewID,
                "interviewerResponse": false ,
                "feedback": $scope.message.message
            }
            }).success(function(response){
                    console.log('Success', response);
                    bootbox.alert("Interview request has been rejected.");  
                    $('.modal-backdrop').css( "display" ,"none" );
                    $state.reload('home.interview.new');
    
            }).error(function(response){
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })  
        }
    }

    /*=============================End: accept or decline interview ================================*/
    
    $scope.messageCandidate = function ( data ) {
        $scope.message = {};
        $scope.message.interviewID = data;
        $("#message").modal();
    };
    
   

}]);