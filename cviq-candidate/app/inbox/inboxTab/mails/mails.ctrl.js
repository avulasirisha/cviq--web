angular.module('Cviq').controller('mailsCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window){


    if($cookieStore.get('AccessToken') == undefined){
        $state.go('home.login');
    }

   /*=============================Start: Get All recruiter Messages ================================*/

    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/candidate/fetchCandidateInboxMessages',
        headers: {
            authorization: $cookieStore.get('AccessToken')
        }
    })
        .success(function(response){
            console.log('success', response);
            $scope.allRecruiterMessages = response.data;
        })
        .error(function(response){
            console.log('Error', response);
        })

    /*=============================End: Get All recruiter Messages ================================*/

    /*=============================Start: Get complete chat with recruiter ================================*/

    $scope.getConversation = function(data){
        console.log(data);
        $cookieStore.put('ChatHistory', data);
        $state.go('home.inbox.inboxTab.chat');
    };

    /*=============================End: Get complete chat with recruiter ================================*/
}]);