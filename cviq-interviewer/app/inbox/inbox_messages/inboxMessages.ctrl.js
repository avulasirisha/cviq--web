angular.module('Cviq').controller('inboxMessagesCtrl', ['$scope','$rootScope','ngDialog','$http','CONSTANT','characterService','$state','$cookieStore','$timeout','$window','$location', function($scope, $rootScope, ngDialog, $http, CONSTANT, characterService, $state, $cookieStore, $timeout, $window,$location){

    if($cookieStore.get('AccessToken') == undefined){
        $scope.confirmLogOut();
    }

    $scope.attached = false;

    $scope.inbox = true;
    $scope.textareaError = false;

    $rootScope.loading = true;

   $scope.data = {};

    var idArray = $location.absUrl().split('+');
   $scope.data.inboxID = idArray[1];
    console.log( "id is ",$scope.data.inboxID );





    $http({
        method: 'GET',
        url: CONSTANT.apiUrl + '/api/interviewer/getAllMessages',
        headers:{
            'authorization': $cookieStore.get("AccessToken")
        },
        params: $scope.data
    })
        .success(function (response) {
            console.log("response is  ",response.data);
            $scope.inboxMessages = response.data;
            $scope.messagesArray = response.data.messageDetail;
            $rootScope.loading = false;
        })
        .error(function (response) {
            console.log(response);
            $rootScope.loading=false;
            if(response.statusCode == 401){
                $scope.confirmLogOut();
                bootbox.alert(response.message);
            }
            else
                bootbox.alert(response.message);
        });


    $scope.test = function() {
        $scope.attached = true;
        $scope.attachmentName = $('#messagefile')[0].files[0].name;
        console.log("hello",$('#messagefile')[0].files[0].name);
    };



    $scope.sendMessage = function () {
        $scope.attachment = $('#messagefile')[0].files[0];
        console.log("file is ",$scope.attachment);

        console.log($scope.attachment,$scope.messageText);

        if( ($scope.messageText == undefined || $scope.messageText.length < 2)&& $scope.attachment == undefined ){
            $scope.textareaError = true;
        }
        else{

            $rootScope.loading = true;
            $scope.textareaError = false;


            var data = new FormData();

            data.append("_id",$scope.inboxMessages._id);
            data.append("candidateID", $scope.inboxMessages.candidateID._id);
            data.append("message", $scope.messageText);
            data.append("messageTitle", $scope.inboxMessages.messageTitle);
            if($scope.attachment != undefined)
                data.append("attachment",$scope.attachment);


            $http({
                method:'POST',
                url:CONSTANT.apiUrl + '/api/interviewer/messageToCandidate',
                headers:{
                    'authorization': $cookieStore.get('AccessToken'),
                    'Content-type': undefined
                },
                data : data

            })
                .success(function(response){

                    console.log("success",response.data);
                    $scope.attached = false;
                    $scope.attachmentName = undefined;
                    $scope.messageText = undefined;
                    $scope.attachment = undefined;
                    $('#messagefile').val("");


                    $http({
                        method: 'GET',
                        url: CONSTANT.apiUrl + '/api/interviewer/getAllMessages',
                        headers:{
                            'authorization': $cookieStore.get("AccessToken")
                        },
                        params: $scope.data
                    })
                        .success(function (response) {
                            console.log("response is  ",response.data);
                            $scope.inboxMessages = response.data;
                            $scope.messagesArray = response.data.messageDetail;

                        })
                        .error(function (response) {
                            console.log("error", response);

                        });

                    $rootScope.loading = false;
                })
                .error(function(response){
                    $rootScope.loading = false;
                    console.log(response);
                    ngDialog.close();
                    if(response.statusCode == 401){
                        $scope.confirmLogOut();
                    }
                    else
                        bootbox.alert(response.message);

                });
        }



    }

}]);


/*=============================Start: Update certificates trigger immediately ================================*/

angular.module('Cviq').directive('validFile',function(){
    return {
        require:'ngModel',
        link:function(scope,el,attrs,ngModel){
            //change event is fired when file is selected
            el.bind('change',function(){
                scope.$apply(function(){
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                })
            })
        }
    }
});

/*=============================End: Update certificates trigger immediately ================================*/