angular.module('Cviq').controller('descriptionCtrl', ['$scope','$rootScope','$cookieStore','ngDialog','$http','CONSTANT','$state','$timeout', function($scope, $rootScope, $cookieStore, ngDialog, $http, CONSTANT, $state, $timeout){


    $scope.number = 5;
    $scope.getNumber = function (num) {
        return new Array(num);
    }


    //$scope.rateLater = function () {
    //    ngDialog.open({
    //        template: 'templateId',
    //        className: 'ngdialog-theme-default',
    //        scope: $scope,
    //        closeByEscape:false,
    //        closeByDocument:false
    //    });
    //};

    $scope.score = {};

    $scope.candidateDetails = JSON.parse(localStorage.getItem('CandidateDetails'));
    
    console.log('$scope.candidateDetails', $scope.candidateDetails); 
    if($scope.candidateDetails.candidateQualitativeScore > 1){   
        $scope.score = {
            backgroundPoints:$scope.candidateDetails.candidateBackgroundPoints,
            communicationPoints:$scope.candidateDetails.candidateCommunicationPoints,
            socialPoints:$scope.candidateDetails.candidateSocialSkillPoints,
            leadershipPoints:$scope.candidateDetails.candidateLeadershipPoints,
            feedback: $scope.candidateDetails.interviewerFeedback
        }
    }

    if($scope.candidateDetails.interviewerFeedback != undefined){
        $scope.score.feedback = $scope.candidateDetails.interviewerFeedback
    }

    if($scope.candidateDetails.candidateRating > 0){
        $scope.ratings = [{
            current: $scope.candidateDetails.candidateRating+1,
            max: 5
        }];
    }

    $scope.startInterviewDetails = JSON.parse(localStorage.getItem('StartInterviewDetails'));
    console.log('as', $scope.startInterviewDetails);

    /*=============================Start: submit qualitative score ================================*/

    $scope.submitScore = function (data) {
        console.log('submitScore', data);
        var interviewId;
        console.log( "interviewid",  $scope.candidateDetails.interviewID  );
        if(  $scope.startInterviewDetails == undefined ){
                interviewId = $scope.candidateDetails.interviewID ;
        }else{
             interviewId = $scope.startInterviewDetails._id;
        }
 
        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/interviewer/rateQualScoreByInterviewer',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                "candidateID": $scope.candidateDetails._id,
                "interviewID": interviewId,
                "candidateRating": $scope.rateToCandidate,
                "rateLater": false,
                "backgroundScore": data.backgroundPoints,
                "communicationScore": data.communicationPoints,
                "socialSkillScore": data.socialPoints,
                "leadershipScore": data.leadershipPoints,
                "feedback": data.feedback
            }
        })
            .success(function(response){
                console.log('Success', response);
                bootbox.alert(response.message);
                $timeout(function () {
                    $state.go('home.dashboard');
                },0);
            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
    }

    /*=============================End: submit qualitative score ================================*/


    /*=============================Start: reset and rate later functions ================================*/
    
    $scope.checKeys = function( even ){
    var keys = even.target.value ;
        if( keys.length > 2 ){
                console.log( keys.length,  ((keys.length)-1) ) ;
                even.target.value = parseInt(  keys.substr( 0, ((keys.length)-1) ) );
        }                
    }

    $scope.resetData = function () {
        $scope.score = {};
    }
    
    $scope.rateLaterPopup = function () {

        ngDialog.open({
            template: 'rateLater',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

    }

    $scope.rateLaterForRating = function (feed) {

        var rateLaterData = {
            "candidateID": $scope.candidateDetails._id,
            "interviewID": $scope.startInterviewDetails._id,
            "candidateRating": $scope.rateToCandidate,
            "rateLater": true
        }

        if(feed != undefined) {
            rateLaterData.feedback = feed.feedback
        }

        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/interviewer/rateQualScoreByInterviewer',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: rateLaterData
        })
            .success(function(response){
                ngDialog.close();
                console.log('Success', response);
                bootbox.alert(response.message);
                $timeout(function () {
                    $state.go('home.dashboard');
                },0);

            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }

    /*=============================End: reset and rate later functions ================================*/


    /*=============================Start: rating functions ================================*/

    if($scope.candidateDetails.candidateRating == 0) {
        $scope.ratings = [{
            current: 1,
            max: 5
        }];
    }

    $scope.rateToCandidate;
    $scope.getSelectedRating = function (rating) {
        console.log(rating);
        $scope.rateToCandidate = rating;
    }

    /*=============================End: rating functions ================================*/
    
    
    
     $scope.pastInterview = function (data) {
       
        $scope.paginationData = {
            start:0,
            limit:10,
            from:'INTERVIEWER',
            cid:  $scope.candidateDetails._id
        }
        
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


     $scope.viewChat = function (interview, status) {
console.log(interview);
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
                            textData1 = {text: 'Interviewer', style: 'title'};
                            textData2 = {text: value.message, style: 'myStyle'};
                            contentArray.push(textData1, textData2);
                        } else {
                            textData1 = {text: 'Candidate', style: ['title', 'anotherStyle']};
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
                        pdfMake.createPdf(docDefinition).download( $scope.candidateDetails.firstName + "_"+date+'_Chat.pdf');
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

angular.module('Cviq').directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);

angular.module('Cviq').directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating1">' +
        '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
        '\u2605' +
        '</li>' +
        '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i+1 < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 2;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});