angular.module('Cviq').controller('chatCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){

    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

    $scope.openFile = function () {
        $('#conFile').click();
    };

    /*=============================Start: Get complete chat with recruiter ================================*/

    $scope.allConversationalMessages;

        var chatID = {
            inboxID: $cookieStore.get('ChatHistory')
        };

        $http({
            method: 'GET',
            url: CONSTANT.apiUrl + '/api/candidate/getAllInboxMessages',
            headers: {
                authorization: $cookieStore.get('AccessToken')
            },
            params: chatID
        })
            .success(function(response){
                console.log('success', response);
                $scope.allConversationalMessages = response.data;
                console.log('$scope.allConversationalMessages', $scope.allConversationalMessages);
            })
            .error(function(response){
                console.log('Error', response);
            })

    /*=============================End: Get complete chat with recruiter ================================*/


    /*=============================Start: Send Message to recruiter ================================*/

    $scope.sendMessage = function () {
        console.log($scope.message);

        var messageData = new FormData;
              console.log(messageData);                                                 
        if( $scope.allConversationalMessages.interviewerID != undefined ){      
            messageData.append('interviewerID', $scope.allConversationalMessages.interviewerID._id);
            var A_URL  =  CONSTANT.apiUrl + '/api/candidate/messageToInterviewer';
            messageData.append('_id', $scope.allConversationalMessages._id);
        }else{
        
            messageData.append('recruiterID', $scope.allConversationalMessages.recruiterID._id);
            var A_URL  =  CONSTANT.apiUrl + '/api/candidate/messageToRecruiter';
            messageData.append('inboxID', $scope.allConversationalMessages._id);
        }




        if($scope.message != undefined){
            messageData.append('message', $scope.message);
        }
        else{
            messageData.append('message', '');
        }

        if($('#conFile')[0].files[0] != undefined){
            messageData.append('attachment', $('#conFile')[0].files[0]);
        }
        $rootScope.loading = true;

        $http({
            method: 'POST',
            url: A_URL,
            headers: {
                authorization: $cookieStore.get('AccessToken'),
                'Content-type': undefined
            },
            data: messageData
            //console.log(data);
        })
            .success(function(response){
                console.log('success', response);
                $state.reload('home.inbox.inboxTab.chat');
                $rootScope.loading = false;
            })
            .error(function(response){
                console.log('Error', response);
                $rootScope.loading = false;
            })
    }


    
    /*=============================End: Send Message to recruiter ================================*/
    
    $scope.changeAttach = function () {
        console.log($('#conFile')[0].files[0].name);
        $scope.attFileName = $('#conFile')[0].files[0].name;
    }

}]);