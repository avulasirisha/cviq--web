angular.module('Cviq').controller('pastInterviewCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window){


    /*=============================Start: Get past interviews ================================*/
        $scope.candidateDetails = JSON.parse(localStorage.getItem('UserDetails'));

    $scope.pastInterview = function (data) {

        $scope.paginationData = {
            start:0,
            limit:10
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

    $scope.viewChat = function (interview , status) {

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
                        //var win = window.open('', '_blank');
                        pdfMake.createPdf(docDefinition).print();
                        //$window.open(docDefinition);
                    }
                    else{
                        var date = interview.interviewDate.split("T")[0];
                        pdfMake.createPdf(docDefinition).download( $scope.candidateDetails.firstName + "_"+date +'_Chat.pdf');
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

   
    $scope.rateToCandidate={};
    $scope.getSelectedRating = function (rating,id) {
        console.log(rating);
        $scope.rateToCandidate[id] = rating;
    }
        //$scope.openPdf = function() {
        //    console.log('OPEN');
        //    pdfMake.createPdf(docDefinition).open();
        //};

        //$scope.downloadPdf = function() {
        //    console.log('DOWNLOAD');
        //    pdfMake.createPdf(docDefinition).download('Interview_Chat.pdf');
        //};
  $scope.submit_reviews =function( id ){
     
     if(  id.description != '' ){      
       var data  = {
          'description': id.description,
          'rating' : $scope.rateToCandidate[id],
          'interviewerID':id.interviewerID._id ,
          'interviewID':   id._id
       } ;
        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/candidate/submitCandidateRating',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data:data
        })
        .success(function(response){
            console.log('Past Interview Success', response);
            bootbox.alert('successfully given feedback');
            $state.reload('home.dashboard.qualitativeScore.pastInterview');
        }).error(function(response){
            bootbox.alert(response.message);
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