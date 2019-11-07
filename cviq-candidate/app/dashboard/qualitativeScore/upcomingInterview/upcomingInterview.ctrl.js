angular.module('Cviq').controller('upcomingInterviewCtrl', ['$scope','$rootScope','$cookieStore','$http','CONSTANT','$timeout','$state','$window','ngDialog', function($scope, $rootScope, $cookieStore, $http, CONSTANT, $timeout, $state, $window, ngDialog){


    /*=============================Start: Get upcoming interviews ================================*/


        $http({
            method: 'GET',
            url: CONSTANT.apiUrl + '/api/candidate/getUpcomingInterviews',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log('Upcoming Interview', response);
                $scope.upcomingInterviewDetails = response.data[0];

                if(response.data.length >= 1){
                    $scope.interviewerSkills = response.data[0].interviewerID.technicalSkills;
                    $scope.inbox = response.data[0].inboxId;
                }
            })
            .error(function(response){
                console.log(response);
            })

    /*=============================End: Get upcoming interviews ================================*/

    /*=============================Start: cancel interviews ================================*/
    
    $scope.cancelInterviewPopup = function () {
        ngDialog.open({
            template: 'cancelInterview',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    }
    
    $scope.denyCancelInterview = function () {
        ngDialog.close();
    }
    
    $scope.confirmCancelInterview = function (data) {

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/cancelInterview',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                interviewID:data
            }
        })
            .success(function(response){
                console.log('Success', response);
                ngDialog.close();
                bootbox.alert(response.message);
                $state.go('home.dashboard.qualitativeScore.pastInterview',{}, { reload: true});

            })
            .error(function(response){
                console.log(response);
                //if(response.statusCode == 401){
                //    $rootScope.sessionExpired();
                //}
            })
        
    }

    /*=============================End: cancel interviews ================================*/

    /*=============================Start: start interviews ================================*/

    $scope.startInterview = function(data){

        $http({
            method: 'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/startInterviewByCandidate',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            data: {
                interviewID:data
            }
        })
            .success(function(response){
                console.log('Success', response);
                localStorage.setItem('StartInterviewDetails', JSON.stringify(response.data));
                $state.go('home.skypeInterview');
                $rootScope.scrollToTop();

            })
            .error(function(response){
                console.log(response);
            })

    }
    
    $scope.start_chat = function () {
        if( $scope.inbox != '' ){
            $cookieStore.put('ChatHistory', $scope.inbox );
            $state.go('home.inbox.inboxTab.chat');           
        }else{
            $scope.message = {};
            $("#message").modal();
        }
    };

    $('#messagefile').change(function () {
        $scope.attached = true;
        $scope.attachmentName = $('#messagefile')[0].files[0].name;
        console.log("hello",$('#messagefile')[0].files[0].name);
        $scope.$apply();
    });

    
    $scope.sendMessage = function () {
        // $rootScope.loading = true;
        $scope.message.attachment = $('#messagefile')[0].files[0];

        $scope.messageModalError = false;
        $scope.messageModalTitleError = false;

        if($scope.message.messageTitle == undefined || $scope.message.messageTitle.length < 2){
            // $rootScope.loading = false;
            $scope.messageModalTitleError = true;
        }
        if( ($scope.message.message == undefined || $scope.message.message.length < 2)&& $scope.message.attachment == undefined ){
            $scope.messageModalError = true;
            // $rootScope.loading = false;
        }
        if(!($scope.message.messageTitle == undefined || $scope.message.messageTitle.length < 2) && !( ($scope.message.message == undefined || $scope.message.message.length < 2)&& $scope.message.attachment == undefined )){

           $rootScope.loading = true;

            
            $scope.message._id = '';
            $scope.message.interviewerId = $scope.upcomingInterviewDetails.interviewerID._id;

            console.log("file is ",$scope.message,$scope.loading);

            var data = new FormData();

            data.append("_id", '');
            data.append("interviewerID", $scope.upcomingInterviewDetails.interviewerID._id );
            data.append("message", $scope.message.message);
            data.append("messageTitle", $scope.message.messageTitle);
            if($scope.message.attachment != undefined)
                data.append("attachment",$scope.message.attachment);


            $http({
                method:'POST',
                url:CONSTANT.apiUrl + '/api/candidate/messageToInterviewer',
                headers:{
                    'authorization': $cookieStore.get('AccessToken'),
                    'Content-type': undefined
                },
                data : data

            })
                .success(function(response){
                    $rootScope.loading = false;

                    console.log("success",response);
                    bootbox.alert("Message Sent Successfully");
                    $("#message").modal("hide");
                    $('#messagefile').val(undefined);
                    $state.reload("home.inbox.inboxTab.mails");
                    $scope.attachmentName = '';

                })
                .error(function(response){
                    $rootScope.loading = false;
                    console.log(response);
                    bootbox.alert(response.message);
                    $("#message").modal("hide");
                    $('#messagefile').val(undefined);
                    $scope.attachmentName = '';

                    if(response.statusCode == 401){
                        $scope.confirmLogOut();
                    }
                });
        }
        
    };

    /*=============================End: start interviews ================================*/

}]);