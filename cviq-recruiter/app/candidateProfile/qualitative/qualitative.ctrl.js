angular.module('Cviq').controller('qualitativeCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','$location', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window,$location){

     $rootScope.loading=true;
    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }
    
    
    $scope.percentageValue = 150;

    $scope.candidateQualScore = false;

    $scope.fixHeight = false;

    var candArray =  $location.absUrl().split('+');

    $scope.data = {};
    $scope.data.candidateID = candArray[1];
    console.log("cad id", $scope.data.candidateID);


    $scope.maxQualitative = {};
    $scope.candidateQualitative = {};



    $http({
        method:'GET',
        url:CONSTANT.apiUrl + '/api/recruiter/getCandidateQualScore',
        headers:{
            'authorization': $cookieStore.get('AccessToken'),
        },
        params: $scope.data,
    })
        .success(function (response) {
            $rootScope.loading = false;
            console.log("response",response.data);
            
            $scope.maxQualitative.totalBackgroundPoints = response.data.totalBackgroundPoints;
            $scope.maxQualitative.totalCommunicationPoints = response.data.totalCommunicationPoints;
            $scope.maxQualitative.totalLeadershipPoints = response.data.totalLeadershipPoints;
            $scope.maxQualitative.totalQualitativeScore = response.data.totalQualitativeScore;
            $scope.maxQualitative.totalSocialSkillPoints = response.data.totalSocialSkillPoints;

            $scope.membershipTaken = response.data.membershipTaken;
            $scope.interviewshiptaken = response.data.interviewshiptaken;
            $scope.alreadyAlertSent = response.data.alreadyAlertSent;
            
            $scope.candidateQualitative.candidateBackgroundPoints = response.data.candidateBackgroundPoints;
            $scope.candidateQualitative.candidateCommunicationPoints = response.data.candidateCommunicationPoints;
            $scope.candidateQualitative.candidateLeadershipPoints = response.data.candidateLeadershipPoints;
            $scope.candidateQualitative.candidateQualitativeScore = response.data.candidateQualitativeScore;
            $scope.candidateQualitative.candidateSocialSkillPoints = response.data.candidateSocialSkillPoints;

            if($scope.candidateQualitative.candidateQualitativeScore == 0){
                $scope.candidateQualScore = false;
            }
            else{
                $scope.candidateQualScore = true;
            }

        })
        .error(function (response) {
            console.log("error",response);
            $rootScope.loading = false;
            if(response.statusCode == 401){
                $scope.confirmLogOut();
            }

        })


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
        }).success(function (response) {
                $state.go("home.candidateGateway", {"candidate":  $scope.data.candidateID, "Payment": response.data.planRate});
                $('.alertButton').prop('disabled', false);
                $rootScope.loading = false;
                console.log("response",response.data);
        }).error(function (response) {
                $rootScope.loading = false;
                $('.alertButton').prop('disabled', false);
                console.log("error",response);
                bootbox.alert(response.message);

                if(response.statusCode == 401){
                    $scope.confirmLogOut();
                }

        });
    }




    /*=============================Start: Get past interviews ================================*/

    $scope.pastInterview = function (data) {

        $scope.paginationData = {
            start:0,
            limit:10,
            from:'INTERVIEWER',
            cid:  $scope.data.candidateID
        }
        $scope.ratings = {};
        
        $scope.reviewdata ={}; 
        console.log('page number', data);

        if(data && data > 1) {
            $scope.paginationData.start = (data-1) * $scope.paginationData.limit;
            console.log('page number1111', $scope.paginationData.start);
        }

        $http({
            method: 'GET',
            url: CONSTANT.apiUrl + '/api/candidate/getPastInterviews',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params: $scope.paginationData
        })
            .success(function(response){
                console.log('Past Interview Success', response);

                $scope.numberOFInterviews = response.data.totalCount;
               
                if(response.data.interviewList.length >= 1){

                    angular.forEach( response.data.interviewList , function (value, key) {
                          response.data.interviewList[key].interviewStartDate =  new Date( response.data.interviewList[key].interviewStartDate );
                    });
                    $scope.interviewLIsts = response.data.interviewList;
                    console.log('$scope.interviewLIsts', $scope.interviewLIsts);
                    
                    

                    $scope.numberOFInterviews = response.data.totalCount;
                  
                      $scope.ratings = [{
                          current: 1,
                          max: 5
                      }];

                  

                    $scope.filteredData = [],
                        $scope.currentPage = data,
                        $scope.numPerPage = 10,
                        $scope.maxSize = 5;

                    $scope.$watch('currentPage + numPerPage', function() {
                        $scope.filteredData = $scope.interviewLIsts.slice(0, 10);
                    });

                }

            })
            .error(function(response){
                console.log(response);
            })

    }

    /*=============================End: Get past interviews ================================*/

    $scope.viewChat = function (interview, status) {

        $http({
            method: 'GET',
            url: CONSTANT.apiUrl + '/api/common/getAllChatMessages',
            params:{
                interviewID: interview._id
            }
        })
            .success(function(response){
                console.log('Chat Messages Success', response);
                var allChatMesssages = response.data;

                var docDefinition, textData1, textData2;
                var contentArray = [];

                if(allChatMesssages.length > 0){
                    
                    angular.forEach(allChatMesssages, function (value) {

                        if(value.messageTo == 'INTERVIEWER'){
                            textData1 = {text: 'Candidate', style: 'title'};
                            textData2 = {text: value.message, style: 'myStyle'};
                            contentArray.push(textData1, textData2);
                        } else {
                            textData1 = {text: 'Interviewer', style: ['title', 'anotherStyle']};
                            textData2 = {text: value.message, style: ['myStyle', 'anotherStyle']};
                            contentArray.push(textData1, textData2);
                        }
                    })

                    docDefinition = {

                        header: {
                            text: 'CVIQ',
                            style: 'mainHead'
                        },

                        content: contentArray,

                        styles: {
                            title: {
                                fontSize: 14,
                                bold: true,
                                color: '#337ab7'
                            },
                            anotherStyle: {
                                italic: true,
                                alignment: 'right'
                            },
                            myStyle:{
                                fontSize: 11,
                                marginBottom: 10
                            },
                            mainHead: {
                                alignment: 'center',
                                marginTop:20,
                                bold: true
                            }
                        }
                    }
                    if(!status){
                        pdfMake.createPdf(docDefinition).open();
                    }
                    else{
                        var date = interview.interviewDate.split("T")[0];
                        pdfMake.createPdf(docDefinition).download( $scope.profile.firstName + "_"+date +'_Chat.pdf');
                    }
                }

                else{
                    bootbox.alert('No messages available.');
                }

            })
            .error(function(response){
                console.log('Chat Messages Error', response);
            })
        
    }










}]);