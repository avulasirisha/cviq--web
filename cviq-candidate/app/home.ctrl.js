angular.module('Cviq').controller('homeCtrl', ['$scope','$rootScope','$cookieStore','ngDialog','$http','CONSTANT','$state','$timeout','characterService','socket', function($scope, $rootScope, $cookieStore, ngDialog, $http, CONSTANT, $state, $timeout, characterService, socket){


    var loggedInVar = $cookieStore.get('loggedIn');
    if(loggedInVar == undefined || loggedInVar == false){
        $scope.loggedIn = false;
    }
    else{
        $scope.loggedIn = true;
    }

    //$scope.userData = $cookieStore.get('UserDetails');
    $scope.userData = JSON.parse(localStorage.getItem('UserDetails'));

    $scope.logout = function(){
        ngDialog.open({
            template: 'logout',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape:false,
            closeByDocument:false
        });
    }

    $scope.denyLogOut = function () {
        ngDialog.close();
    }
    $scope.confirmLogOut = function () {
        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/candidate/logout',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log(response);
                ngDialog.close();
                $cookieStore.put('loggedIn', false);
                $cookieStore.remove('loggedIn');
                $cookieStore.remove('AccessToken');
                document.cookie = "loggedIn=false;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "CandidateOpt=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                //$cookieStore.remove('UserDetails');
                localStorage.removeItem('UserDetails');
                sessionStorage.removeItem('SearchedParameter');
                $state.go('home.homeScreen.search');
                $timeout(function () {
                    $state.reload();
                }, 500);
            })
            .error(function(response){
                console.log(response);
                ngDialog.close();
                $cookieStore.put('loggedIn', false);
                $cookieStore.remove('loggedIn');
                $cookieStore.remove('AccessToken');
                document.cookie = "loggedIn=false;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "CandidateOpt=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                //$cookieStore.remove('UserDetails');
                localStorage.removeItem('UserDetails');
                sessionStorage.removeItem('SearchedParameter');
                $state.go('home.homeScreen.search');
                $timeout(function () {
                    $state.reload();
                }, 500);
            })
    }

    $scope.var = $state.params.var;

    $scope.toggle = function(){
        $('.menu-sec').slideToggle();
    }


    /*=============================Start: Toggle Navigation Menu ================================*/
    $timeout(function () {
        if ($(window).width() < 780) {
            $('.menu-sec ul li a').click(function () {
                $('.menu-sec').slideUp();
            });
        }
    },0);

    /*=============================End: Toggle Navigation Menu ================================*/

    /*=============================Start: Custom Factory Function ================================*/

    $scope.FirsText = function($event){
        characterService.characterFunction($event);
    };

    $scope.isNumberKey = function($event){
        characterService.numberFunction($event);
    };

    $scope.isCodeKey = function($event){
        characterService.codeFunction($event);
    };

    $scope.isAlphaKey = function($event){
        characterService.alphaFunction($event);
    };
    $scope.isSpecialKey = function($event){
        characterService.specialFunction($event);
    };

    /*=============================End: Custom Factory Function ================================*/

    $scope.goToUpcomingInterview = function ( id ) {
      //  $state.go('home.dashboard.qualitativeScore.upcomingInterview',{}, {reload: true});
        delete $scope.notification[id] ;
        $('.notification').toggleClass('displayDropDown');
        $state.go('home.dashboard.qualitativeScore.upcomingInterview');
        window.scrollTo(0, 500);
    }

    $scope.goToAggregaredScore = function (id ) {
        delete $scope.notification[id] ;
        $('.notification').toggleClass('displayDropDown');
        $state.go('home.dashboard.qualitativeScore.pastInterview');
        window.scrollTo(0, 500);
    }

    $scope.goToRecruiterMessage = function ( id ) {
         
        $('.notification').toggleClass('displayDropDown');
      //  $state.go('home.inbox.inboxTab.mails',{}, {reload: true});
       $state.go('home.inbox.inboxTab.mails');
       window.scrollTo(0, 10);
    }

    /*=============================Start: Interview notification through socket ================================*/

    socket.emit('messageFromClient',{
        'accessToken':$cookieStore.get('AccessToken'),
        'USER_TYPE':'CANDIDATE'
    });

    socket.on('messageFromServer', function (msg) {
        console.log('messageFromServer', msg);
    });

    $scope.notification = [];

    console.log('========', $scope.notification.length);

    //socket.on('onInterviewAcceptDecline', function (data) {
    //    console.log('onInterviewAcceptDecline', data);
    //    $scope.notification.push(data.message.notificationMsg);
    //    $scope.$apply();
    //
    //});
    $scope.call_notification = function(){
        $('.notification').toggleClass('displayDropDown');
        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/NotificationTimer',
            params:{ userType:'CANDIDATE' },
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
        .success(function(response){
                console.log(response);
        })
        .error(function(response){
                console.log(response);
        })
    }


    socket.on('onInterviewAcceptDecline', function (data) {
        console.log('onInterviewAcceptDecline', data);
        $scope.notification.push({
            message: data.message.notificationMsg,
            notificationType: data.message.notificationType
        });
        $scope.$apply();

    });

    socket.on('onRateScoreByInterviewer', function (data) {
        console.log('onRateScoreByInterviewer', data);
        $scope.notification.push({
            message: data.message.notificationMsg,
            notificationType: data.message.notificationType
        });
        $scope.$apply();

    });

    socket.on('messageToCandidate', function (data) {
        console.log('messageToCandidate', data);
        $scope.notification.push({
            message: data.message.notificationMsg,
            notificationType: data.message.notificationType
        });
        $scope.$apply();

    });

    /*=============================End: Interview notification through socket ================================*/
        var msg_not = false;
        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/getnewNotifications',
            params:{ userType:'CANDIDATE' },
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
        .success(function(response){
            console.log( response.data );
            var Data = response.data;
            if( Data.length > 0 ){
                    for( i in Data ){
                        console.log( Data[i]);
                        if( /new message/i.test( Data[i].notificationMsg ) ){
                          msg_not = true;
                        }else{
                            $scope.notification.push({
                                message: Data[i].notificationMsg,
                                notificationType: Data[i].notificationType
                            });    
                        } 
                    }  
                    if( msg_not == true ){
                        $scope.notification.push({
                            message: 'You have received new Messages',
                            notificationType: 6
                        });  
                    }
                    $scope.$apply(); 
            }
        })
        .error(function(response){
                console.log(response);
        })

}]);    