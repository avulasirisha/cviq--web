angular.module('Cviq').controller('homeCtrl', ['$scope','$rootScope','$cookieStore','ngDialog','$http','CONSTANT','$state','$timeout','characterService','socket', function($scope, $rootScope, $cookieStore, ngDialog, $http, CONSTANT, $state, $timeout, characterService, socket){


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

    /*=============================End: Custom Factory Function ================================*/


    $scope.loggedIn = $cookieStore.get('loggedIn');

    $scope.userData = $cookieStore.get('UserDetails');

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
        $scope.loading = true;
        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/interviewer/logoutInterviewer',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                console.log(response);
                $scope.loading = false;
                ngDialog.close();
                $cookieStore.remove('loggedIn');
                $cookieStore.remove('AccessToken');
                $cookieStore.remove('UserDetails');
                $cookieStore.remove('SelIndustryID');
                $cookieStore.remove('StartInterviewDetails');
                $cookieStore.remove('CandidateDetails');
                $cookieStore.remove('SocketID');
                $state.go('home.login',{},{ reload: true });
                //$timeout(function () {
                //    $state.reload();
                //}, 500);
            })
            .error(function(response){
                console.log(response);
            })
    }

    $scope.var = $state.params.var;
    console.log($scope.var);

    $scope.toggle = function(){
        $('.menu-sec').slideToggle();
    }
    
    $scope.call_notification = function(){
        $('.notification').toggleClass('displayDropDown');
        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/NotificationTimer',
            params:{ userType:'INTERVIEWER' },
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




    /*=============================Start: Get Interviewer Profile Function ================================*/

    $scope.userCompleteData = $cookieStore.get('UserDetails');
    
    $scope.goToNewRequest = function ( t, did ) {
        var noti_msg = $scope.notification[did]['notificationMsg'];
          if( /feedback/i.test( noti_msg ) ){
            /*for( i in $scope.notification ){
                var noti_msg = $scope.notification[i]['notificationMsg'];
                if( /feedback/i.test(noti_msg  ) ){
                    delete $scope.notification[i]; 
                }
             } */
            $state.go('home.interview.past');                      
        }else{
          //  delete $scope.notification[did];
              if( t == 9 ){
                  $state.go('home.inbox');
              }else{
                  $state.go('home.interview.new');
              }
        }
      
    }

    /*=============================End: Get Interviewer Profile Function ================================*/

    /*=============================Start: Interview notification through socket ================================*/

    socket.emit('messageFromClient',{
        'accessToken':$cookieStore.get('AccessToken'),
        'USER_TYPE':'INTERVIEWER'
    });

    socket.on('messageFromServer', function (msg) {
        console.log('messageFromServer', msg);
    });

    $scope.notification = [];

    console.log('========', $scope.notification.length);

    socket.on('newRequestToInterviewer', function (data) {
        console.log('newRequestToInterviewer', data);
        $scope.notification.push(data.message);
        $scope.$apply();

        console.log('$scope.notification', $scope.notification);

    });
    
    socket.on('messageToRecruiter', function (data) {
        console.log('messageToRecruiter', data);
        $scope.notification.push(data.message);
        $scope.$apply();

        console.log('$scope.notification', $scope.notification);

    });
   
    socket.on('messageToInterviewer', function (data) {
        console.log('messageToInterviewer', data);
        $scope.notification.push(data.message);
        $scope.$apply();

    });
      var feed_msg = false;
      $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/getnewNotifications',
            params:{ userType:'INTERVIEWER'},
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
                        if( /feedback/i.test( Data[i].notificationMsg  ) ){
                           feed_msg =true; 
                        }else{
                          $scope.notification.push({
                              notificationMsg: Data[i].notificationMsg,
                              notificationType: Data[i].notificationType
                          }); 
                        }    
                    }  
                    if( feed_msg == true ){
                        $scope.notification.push({
                              notificationMsg: 'You have received new feedback',
                              notificationType: 2
                          }); 
                    }
                    $scope.$apply(); 
            }
        })
        .error(function(response){
                console.log(response);
        })
    /*=============================End: Interview notification through socket ================================*/

}]);