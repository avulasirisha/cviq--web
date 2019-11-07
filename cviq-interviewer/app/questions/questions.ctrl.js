angular.module('Cviq').controller('questionsCtrl', ['$scope','$rootScope','$cookieStore','ngDialog','$state','$http','CONSTANT','$timeout','questions', function($scope, $rootScope, $cookieStore, ngDialog, $state, $http, CONSTANT, $timeout, questions){

    if($cookieStore.get('AccessToken') == undefined || $cookieStore.get('AccessToken') == ''){
        $state.go('home.login');
    }

    // $( document ).ready(function() {
    //     $('.dropdown').each(function (key, dropdown) {
    //         var $dropdown = $(dropdown);
    //         $dropdown.find('.dropdown-menu a').on('click', function (e) {
    //             e.preventDefault();
    //             $dropdown.find('button').text($(this).text());
    //         });
    //     });
    // });

    $timeout(function(){
        $('.selectpickers').selectpicker();
    },0);


    /*=============================Start: get industry and functional area list ================================*/

    $http({
        method:'GET',
        url: CONSTANT.apiUrl + '/api/common/getDropDownData'
    })
        .success(function(response){
            console.log(response);
            $scope.industries = response.data.industryList;
            $timeout(function(){
                $('.selectpicker').selectpicker('refresh');
            },0);
        })
        .error(function(response){
            console.log(response);
        });


    
    $scope.getIndustryId = function (data) {
        console.log(data);

        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/getFunctionalAreaList',
            params:{
                industryID: data._id
            }
        })
            .success(function(response){
                console.log(response);
                $scope.functionalAreaList = response.data;
                $timeout(function(){
                    $('.selectpicker').selectpicker('refresh');
                },0);
            })
            .error(function(response){
                console.log(response);
            })
    }

    /*=============================Start: get industry and functional area list ================================*/

    var allNonTechnicalQues, allTechnicalQues;
    $scope.allQuestions = [];

    questions.getQuestions().then(function (response) {
        console.log('questions.getQuestions', response);   
        allNonTechnicalQues = response.data.nonTechnicalQuestions;
        allTechnicalQues = response.data.technicalQuestions;

        $scope.allQuestions.push.apply($scope.allQuestions, allNonTechnicalQues);
        $scope.allQuestions.push.apply($scope.allQuestions, allTechnicalQues);   

    }, function(error){
        console.log('questions.getQuestions error', error);
    });

    //$http({
    //    method: 'GET',
    //    url: CONSTANT.apiUrl + '/api/interviewer/getQuestions',
    //    headers: {
    //        authorization: $cookieStore.get('AccessToken')
    //    }
    //})
    //    .success(function(response){
    //        console.log('Success', response);
    //
    //        allNonTechnicalQues = response.data.nonTechnicalQuestions;
    //        allTechnicalQues = response.data.technicalQuestions;
    //
    //        $scope.allQuestions.push.apply($scope.allQuestions, allNonTechnicalQues);
    //        $scope.allQuestions.push.apply($scope.allQuestions, allTechnicalQues);
    //
    //        console.log('asd', $scope.allQuestions);
    //    })
    //    .error(function(response){
    //        console.log(response);
    //    })

    $scope.searchQuestions = function (searchData) {

        if(searchData == undefined){
            return;
        }

        $scope.interviewQues = 'All';

        $scope.allQuestions = [];

        console.log('searchData', searchData);


        var searchQuestionObj = {}
        
        if(searchData.industry != undefined){
            searchQuestionObj.industry = searchData.industry.industryName
        }
        
        if(searchData.functionalArea != undefined){
            searchQuestionObj.functionalArea = searchData.funArea.functionalAreaName
        }
        if(searchData.keywords != undefined){
            searchQuestionObj.keywords = searchData.keywords
        }


        $http({
            method: 'GET',
            url: CONSTANT.apiUrl + '/api/interviewer/getQuestions',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params: searchQuestionObj
        })
            .success(function(response){
                console.log('Success', response);

                $scope.searchedQuestions = response.data;

                allNonTechnicalQues = response.data.nonTechnicalQuestions;
                allTechnicalQues = response.data.technicalQuestions;

                $scope.allQuestions.push.apply($scope.allQuestions, allNonTechnicalQues);
                $scope.allQuestions.push.apply($scope.allQuestions, allTechnicalQues);

                console.log('asd', $scope.allQuestions);
            })
            .error(function(response){
                console.log(response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })

    }
    
    $scope.filterQuestions = function (val) {
        console.log(val);

        $scope.allQuestions = [];

        if(val == 'Technical'){
            $scope.allQuestions.push.apply($scope.allQuestions, allTechnicalQues);
        }
        else if(val == 'Non-Technical'){
            $scope.allQuestions.push.apply($scope.allQuestions, allNonTechnicalQues);
        }
        else{
            $scope.allQuestions.push.apply($scope.allQuestions, allNonTechnicalQues);
            $scope.allQuestions.push.apply($scope.allQuestions, allTechnicalQues);
        }
    }

    /*=============================Start: add question popup ================================*/
    
    $scope.addQuestionPopup = function () {

        ngDialog.open({
            template: 'addQuestion',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
        },500);

    }

    /*=============================End: add question popup ================================*/

    /*=============================Start: add question ================================*/
    
    $scope.addQuestion = function (questionData) {

        console.log('questionData', questionData);

        $http({
            method: 'POST',
            url: CONSTANT.apiUrl + '/api/interviewer/addQuestionByInterviewer',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data:{
                "question": questionData.ques,
                "industryID": questionData.industry._id,
                "functionalAreaID": questionData.funArea._id,
                "questionType": questionData.qType,
                "industry" :questionData.industry.industryName,
                "functionalArea" : questionData.funArea.functionalAreaName
            }           
        })
            .success(function(response){
                console.log('Success', response);
                ngDialog.close();
                $state.reload();
                $timeout(function () {
                    bootbox.alert('Question added successfully.');
                },0);
            })
            .error(function(response){
                console.log('Error', response);
                bootbox.alert(response.message);
                if(response.statusCode == 401){
                    $rootScope.sessionExpired();
                }
            })
        
    }
    
    /*=============================End: add question ================================*/
    /*=============================start:update question=============================*/
    $scope.updateQuestionPopup = function (data) {
        $scope.newdata = angular.copy(data);

       /* ngDialog.open({
            template: 'updateQuestion',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });*/
        console.log(data);
        ngDialog.open({
            template: 'updateQuestion',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });

        $timeout(function(){
            $('.selectpicker').selectpicker('refresh');
        },500);


    };
    $scope.updateQuestion = function () {

        console.log($scope.newdata);
        $scope.data1 =  {
            "planID": $scope.newdata
        };

        $http({
            method:'PUT',
            url: MY_CONSTANT.url_cviq +'/api/admin/updateRecruiterMembershipPlan',
            headers:{
                'authorization':$cookieStore.get("obj").accessToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                'planID': $scope.newdata._id,
                'planType': $scope.newdata.planType,
                'planRate': $scope.newdata.planRate,
                'planDuration':$scope.newdata.planDuration,
                'jobsPostPerMonth':$scope.newdata.jobsPostPerMonth,
                'jobActiveDays': $scope.newdata.jobActiveDays,
                'planDescription': $scope.newdata.planDescription,
                'sessionBreakInHrs': $scope.newdata.sessionBreakInHrs,
                'searchCandidateInHrs': $scope.newdata.searchCandidateInHrs

            }
        })
            .success(function (data) {
                ngDialog.close();
                console.log(data);
                $http({
                    method:'GET',
                    url: MY_CONSTANT.url_cviq + '/api/admin/getRecruiterMembershipPlan',
                    headers:{
                        'authorization':$cookieStore.get("obj").accessToken,
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                })
                    .success(function (response) {
                        $scope.showloader = false;
                        console.log(response);
                        $scope.list = response.data;

                    })
                    .error(function (response) {
                        $scope.showloader = false;

                        console.log(response);


                    });


            })
            .error(function(response){
                console.log(response);
                if(response.statusCode == 401){
                    $cookieStore.remove('obj');
                    $cookieStore.remove('zoom');
                    $cookieStore.remove('type');
                    $cookieStore.remove('email');
                    $.removeCookie('geoseen');
                    $state.go('page.login');
                }
            });
    };
    /*=============================end:update question=============================*/

}]);