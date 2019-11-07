angular.module('Cviq').controller('homeCtrl', ['$scope','$rootScope','$cookieStore','ngDialog','$http','CONSTANT','$state','$timeout','socket',
    function($scope, $rootScope, $cookieStore, ngDialog, $http, CONSTANT, $state, $timeout,socket){


    var loggedInVar = $cookieStore.get('loggedIn');
    if(loggedInVar == undefined || loggedInVar == false){
        $scope.loggedIn = false;
    }
    else{
        $scope.loggedIn = true;
    }

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
    };
    $scope.confirmLogOut = function () {
        $rootScope.loading= true;
        $http({
            method:'PUT',
            url: CONSTANT.apiUrl + '/api/recruiter/logoutRecruiter',
            headers:{
                authorization: $cookieStore.get('AccessToken')
            }
        })
            .success(function(response){
                $cookieStore.remove('AccessToken');
                $cookieStore.remove('loggedIn');
                $cookieStore.remove('UserDetails');
                $state.go('home.login');
                console.log("going to login page");
                $rootScope.loading= false;
                console.log("response",response);
                ngDialog.close();
               // $cookieStore.put('loggedIn', false);

                $timeout(function () {
                    $state.reload();
                }, 500);
            })
            .error(function(response){
                console.log(response);
                ngDialog.close();
                $cookieStore.remove('AccessToken');
                $cookieStore.remove('loggedIn');
                $cookieStore.remove('UserDetails');
                console.log("going to login page");
                $state.go('home.login');
                $rootScope.loading= false;
                $timeout(function () {
                    $state.reload();
                }, 500);

            })
    };

    $scope.var = $state.params.var;

    $scope.toggle = function(){
        $('.menu-sec').slideToggle();
    };

    $scope.togglehome = function(){
        $('#home').addClass("selected");
        $('#member').removeClass("selected");
        $('#candidate').removeClass("selected");
        $('#inbox').removeClass("selected");

        if($(window).width() < 754){
            $('.menu-sec').slideToggle();
        }
       
    };
    $scope.togglemembership = function(){

        $('#home').removeClass("selected");
        $('#member').addClass("selected");
        $('#candidate').removeClass("selected");
        $('#inbox').removeClass("selected");

        if($(window).width() < 754){
            $('.menu-sec').slideToggle();
        }

    };
    $scope.togglecandidate = function(){
        $('#home').removeClass("selected");
        $('#member').removeClass("selected");
        $('#candidate').addClass("selected");
        $('#inbox').removeClass("selected");

        if($(window).width() < 754){
            $('.menu-sec').slideToggle();
        }

    };
    $scope.toggleinbox = function(){
        $('#home').removeClass("selected");
        $('#member').removeClass("selected");
        $('#candidate').removeClass("selected");
        $('#inbox').addClass("selected");

        if($(window).width() < 754){
            $('.menu-sec').slideToggle();
        }

    }
    $scope.toggle1 = function(){
        $('.registered-user-menu').slideToggle();
        if($(window).width() < 754){
            $('.menu-sec').slideToggle();
        }

    }

      $scope.call_notification = function(){
        $('.notification').toggleClass('displayDropDown');
        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/NotificationTimer',
            params:{ userType:'RECRUITER' },
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


    //======================socket================//

        $scope.notification = [];

        socket.emit('messageFromClient',{
            'accessToken':$cookieStore.get('AccessToken'),
            'USER_TYPE':'RECRUITER'
        });

        socket.on('messageFromServer', function (msg) {
            console.log('messageFromServer', msg);
        });


    socket.on('messageToRecruiter', function (data) {
        console.log('messageToRecruiter', data);
        $scope.notification.push(data.message.notificationMsg);
        $scope.$apply();

    });

        $http({
            method:'GET',
            url: CONSTANT.apiUrl + '/api/common/getnewNotifications',
            params:{ userType:'RECRUITER' },
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
                        $scope.notification.push(Data[i].notificationMsg);     
                    }  
                    $scope.$apply(); 
            }
        })
        .error(function(response){
                console.log(response);
        })


}]);

    //$scope.myClass = [];
    //$scope.myClass1 = [];
    //
    //if($state.current.name == 'home.login'){
    //    $scope.myClass1.push('active');
    //}
    //else{
    //    $scope.myClass.push('active');
    //}
    //
    //$scope.addClass = function(){
    //    $scope.myClass.push('active');
    //    $scope.myClass1.pop('active');
    //}
    //$scope.removeClass = function(){
    //    $scope.myClass1.push('active');
    //    $scope.myClass.pop('active');
    //}

//angular.module('Cviq').directive('myDirective', function(){
//    return {
//        restrict: 'C',
//        link: function(){
//            $('.header ul.auth-menu li').click(function(){
//                $('.header ul.auth-menu li').removeClass('selected');
//                $(this).addClass('selected');
//            });
//        }
//    };
//});

//angular.module('Cviq').directive('navDirective', function(){
//    return {
//        restrict: 'C',
//        link: function(){
//            $('.loggedLogo').click(function () {
//                $('.header ul.auth-menu li').removeClass('selected');
//                $('.header ul.auth-menu li:first-child').addClass('selected');
//            });
//        }
//    };
//});